import express from "express";
const router = express.Router();
import passport from "passport";
import "../middlewares/isAuth";
import { isInstructor } from "../middleware/isInstructor";

const auth = passport.authenticate("jwt", { session: false });

import instructorControllers from "../controllers/instructor.controllers";

router.post(
  "/register",
  auth,
  isInstructor,
  instructorControllers.registerInstructor
);

router.post(
  "/login",
  auth,
  isInstructor,
  instructorControllers.loginInstructor
);

router.delete(
  "/logout",
  auth,
  isInstructor,
  instructorControllers.logoutInstructor
);

router.get("/", auth, isInstructor, instructorControllers.getInstructorProfile);

export default router;
