import { Response, NextFunction } from "express";

export const isStudent = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.user.role) {
    next();
  } else {
    res.json({ msg: "Sorry, you are not Student" });
  }
};
