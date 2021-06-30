import express from "express";
const router = express.Router();
import passport from "passport";
import "../middleware/isAuth";
import { isStudent } from "../middleware/isStudent";

const auth = passport.authenticate("jwt", { session: false });
import studentControllers from "../controllers/student.controllers";
import multer from "multer";

const upload = multer();

router.post("/register", studentControllers.registerUser);

router.post("/login", studentControllers.loginUser);

router.delete("/logout", auth, isStudent, studentControllers.logoutUser);

router.get("/", auth, isStudent, studentControllers.getStudentProfile);

router.get("/tasks", auth, isStudent, studentControllers.getTasks);

router.post(
  "/tasks/:taskId",
  upload.array("photos", 3), // upload max 3 images
  auth,
  isStudent,
  studentControllers.uploadTaskImage
);

router.get(
  "/taskresult/:taskId",
  auth,
  isStudent,
  studentControllers.viewTaskResults
);

export default router;
