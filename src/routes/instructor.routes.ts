import express from "express";
const router = express.Router();
import passport from "passport";
import "../middleware/isAuth";
import { isInstructor } from "../middleware/isInstructor";

const auth = passport.authenticate("jwt", { session: false });

import instructorControllers from "../controllers/instructor.controllers";
import multer from "multer";

const upload = multer();

router.post("/register", instructorControllers.registerInstructor);

router.post("/login", instructorControllers.loginInstructor);

router.delete(
  "/logout",
  auth,
  isInstructor,
  instructorControllers.logoutInstructor
);

router.get("/", auth, isInstructor, instructorControllers.getInstructorProfile);

// Give tasks to students on basis of tracks
router.post(
  "/task",
  auth,
  isInstructor,
  upload.array("photos", 3), // max 3 images
  instructorControllers.createTaskForTracks
);

// View student's submission
router.get(
  "/task/:studentId/:taskId",
  auth,
  isInstructor,
  instructorControllers.getStudentsTaskBasedOnSubmission
);

// Grade students, req.body.grade (1-5)
router.post(
  "/taskresult/:studentId/:taskId",
  auth,
  isInstructor,
  instructorControllers.gradeStudentsBasedOnSubmission
);

export default router;
