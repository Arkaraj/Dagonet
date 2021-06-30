import { Request } from "express";
import { Strategy as JWTStrategy, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import Student from "../models/Student";
import Instructor from "../models/Instructor";

// Getting jwt cookie
const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["auth_token"];
  }
  return token;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: `${process.env.SECRET}`,
    },
    async (payload, done: VerifiedCallback) => {
      if (!payload.isInstructor) {
        try {
          const student = await Student.findById(payload.sub);

          if (student) {
            // res.user - student
            return done(null, student);
          } else {
            done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      } else {
        const instructor = await Instructor.findById(payload.sub);

        if (instructor) {
          return done(null, instructor);
        } else {
          done(null, false);
        }
      }
    }
  )
);
