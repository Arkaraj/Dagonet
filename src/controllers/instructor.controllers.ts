import { Response, Request } from "express";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CallbackError, Types } from "mongoose";

import Instructor, { IInstructor } from "../models/Instructor";
import UploadedTask from "../models/UploadedTask";

const signToken = (id: Types.ObjectId) => {
  return JWT.sign(
    {
      iss: "https://github.com/Arkaraj",
      sub: id,
      isInstructor: true,
    },
    `${process.env.SECRET}`,
    { expiresIn: "365d" }
  ); // '1 year'
};

export default {
  // Usually this is not done...
  registerInstructor: async (req: Request, res: Response) => {
    const {
      email,
      name,
      password,
    }: {
      email: string;
      name: string;
      password: string;
    } = req.body;

    Instructor.find({ email }, async (err: any, userPresent: IInstructor[]) => {
      if (err) {
        res
          .status(500)
          .json({ message: { msg: "Error has occured", msgError: true } });
      }
      if (userPresent.length > 0) {
        res.status(400).json({
          message: {
            msg: "Email already exists",
            msgError: true,
          },
        });
      } else {
        const newInstructor = new Instructor({
          email,
          name,
          password,
        });
        await newInstructor.save();

        res.status(201).json({
          message: {
            msg: "Account successfully created",
            msgError: false,
            user: newInstructor,
          },
        });
      }
    });
  },
  loginInstructor: async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    Instructor.findOne(
      { email },
      (err: CallbackError, user: IInstructor | null) => {
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
      }
    );
  },
  logoutInstructor: async (_req: Request, res: Response) => {
    res.clearCookie("auth_token");
    res.status(200).json({ msg: "Logged out", user: {}, msgError: false });
  },
  getInstructorProfile: async (req: Request, res: Response) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  },
  createTaskForTracks: async (req: any, res: Response) => {},

  getStudentsTaskBasedOnSubmission: async (req: Request, res: Response) => {
    const submission = await UploadedTask.findOne({
      user: req.params.studentId,
      task: req.params.taskId,
    })
      .populate("task")
      .populate("user")
      .exec();

    if (submission) {
      res
        .status(200)
        .json({ submission, task: submission.task, msgError: false });
    } else {
      res.status(200).json({
        msg: "Student has not submitted the Task yet",
      });
    }
  },
  gradeStudentsBasedOnSubmission: async (req: Request, res: Response) => {
    const { grade }: { grade: number } = req.body;

    const submission = await UploadedTask.findOne({
      user: req.params.studentId,
      task: req.params.taskId,
    });

    if (submission) {
      submission.grade = grade;

      submission.save((err) => {
        if (err) {
          res
            .status(500)
            .json({ msg: "Internal Server Error", err, msgError: true });
        } else {
          res.status(200).json({ submission, msgError: false });
        }
      });
    } else {
      res.status(200).json({
        msg: "Student has not submitted the Task yet",
      });
    }
  },
};
