import express from "express";
const router = express.Router();
import passport from "passport";
import "../middlewares/isAuth";
import { isStudent } from "../middleware/isStudent";

const auth = passport.authenticate("jwt", { session: false });
import studentControllers from "../controllers/student.controllers";

router.post("/register", auth, isStudent, studentControllers.registerUser);

router.post("/login", auth, isStudent, studentControllers.loginUser);

router.delete("/logout", auth, isStudent, studentControllers.logoutUser);

router.get("/", auth, isStudent, studentControllers.getStudentProfile);

router.get("/tasks", auth, isStudent, studentControllers.getTasks);

export default router;
