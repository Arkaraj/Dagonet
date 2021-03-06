import { Response, Request } from "express";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CallbackError, Types } from "mongoose";

import Student, { IStudent } from "../models/Student";
import Task from "../models/Task";
import UploadedTask from "../models/UploadedTask";
import { uploadTaskImages } from "../ControllerUtils/imageSending";

const signToken = (id: Types.ObjectId) => {
  return JWT.sign(
    {
      iss: "https://github.com/Arkaraj",
      sub: id,
      isInstructor: false,
    },
    `${process.env.SECRET}`,
    { expiresIn: "365d" }
  ); // '1 year'
};

export default {
  registerUser: async (req: Request, res: Response) => {
    const {
      email,
      name,
      password,
      tracks,
    }: {
      email: string;
      name: string;
      password: string;
      tracks: string;
    } = req.body;

    Student.find({ email }, async (err: any, userPresent: IStudent[]) => {
      if (err) {
        res
          .status(500)
          .json({ message: { msg: "Error has occured", msgError: true } });
      }
      if (userPresent.length > 0) {
        res.status(400).json({
          message: {
            msg: "Email already taken/has an account",
            msgError: true,
          },
        });
      } else {
        const hash = await bcrypt.hash(password, 10);

        const newStudent = new Student({
          email,
          name,
          password: hash,
          tracks,
        }); // new User(req.body)
        newStudent.save((err) => {
          if (err) {
            res.status(500).json({
              message: {
                msg: "Error Occured",
                msgError: true,
                err,
              },
            });
          } else {
            res.status(201).json({
              message: {
                msg: "Account successfully created",
                msgError: false,
                user: newStudent,
              },
            });
          }
        });
      }
    });
  },
  loginUser: async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    Student.findOne({ email }, (err: CallbackError, user: IStudent | null) => {
      if (err) {
        //console.log('Error ' + err)
        res.status(500).json({
          message: { msg: "Error has occured", msgError: true, error: err },
        });
      }
      if (!user) {
        res.status(400).json({
          message: { msg: "Invalid Email", msgError: true },
        });
      } else {
        bcrypt.compare(password, user.password, (err, validate) => {
          if (err) {
            res.status(500).json({
              message: {
                msg: "Error has occured in bcrypting the password",
                msgError: true,
              },
            });
          }
          if (!validate) {
            res
              .status(400)
              .json({ message: { msg: "Invalid Password", msgError: true } });
          } else {
            // Logged in
            const token = signToken(user._id);
            // httpOnly doesn't let client side js touch the cookie saves from cross scripting attacks
            res.cookie("auth_token", token, {
              httpOnly: true,
              sameSite: true,
            });
            res.status(200).json({
              user,
              isAuthenticated: true,
              message: { msgError: false },
            });
          }
        });
      }
    });
  },
  logoutUser: async (_req: Request, res: Response) => {
    res.clearCookie("auth_token");
    res.status(200).json({ msg: "Logged out", user: {}, msgError: false });
  },
  getStudentProfile: async (req: any, res: Response) => {
    /*
    import { Tracks } from "../models/Student"
    if(req.user.tracks == Tracks.beginner) {}
    ...
    */

    res
      .status(200)
      .json({ isAuthenticated: true, user: req.user, track: req.user.track }); // depending on the tracks user will get youtube links
  },

  getTasks: async (req: any, res: Response) => {
    // Find all the tasks for the given student's tasks
    const tasks = await Task.find({ tracks: req.user.tracks });

    // tasks[0].image - will contain the link/path of the image
    res.status(200).json({ tasks, msgError: false });
  },

  uploadTaskImage: async (req: any, res: Response) => {
    const uploadedTask = await UploadedTask.find({
      task: req.params.taskId,
      user: req.user._id,
    });

    if (!uploadedTask) {
      // upload the image back after editing
      if (req.files) {
        const image = await uploadTaskImages(req, false, "", req.user._id);

        if (image) {
          const submission = await UploadedTask.create({
            task: req.params.taskId,
            user: req.user._id,
            image,
          });

          res.status(200).json({
            msg: "Done, uploaded for grading!",
            msgError: false,
            submission,
          });
        } else {
          res.status(500).json({
            msg: "Error in Saving the image",
            msgError: true,
          });
        }
      } else {
        res.status(500).json({
          msg: "Error in Server Side",
          msgError: true,
        });
      }
    } else {
      res.status(200).json({
        msg: "Student already submitted/uploaded Document",
      });
    }
  },

  viewTaskResults: async (req: any, res: Response) => {
    const result = await UploadedTask.findOne({
      task: req.params.taskId,
      user: req.user._id,
    });

    if (result) {
      res.status(200).json({ result, marks: result.grade });
    } else {
      res.status(200).json({ msg: "Task Still not Graded" });
    }
  },
};
