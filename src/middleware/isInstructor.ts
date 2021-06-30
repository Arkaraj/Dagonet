import { Response, NextFunction } from "express";

export const isInstructor = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role) {
    next();
  } else {
    res.json({ msg: "Sorry, you are not Instructor" });
  }
};
