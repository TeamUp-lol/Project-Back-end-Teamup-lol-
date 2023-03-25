import { Router } from "express";

import { UserController } from "../controllers/userController"; 
import { UserService } from "../services/userService";
import { UserModel } from "../models/userModel";
import { verifyToken } from "../middlewares/authMiddleware"

const userController = new UserController(new UserService(new UserModel()));

export const userRoutes = Router();

userRoutes.post("/signup", userController.signupUser);
userRoutes.post("/signin", userController.signinUser);
userRoutes.post("/oauth/success");
userRoutes.get("/oauth/success");
userRoutes.patch("", verifyToken, userController.updateUser);
userRoutes.delete("", verifyToken, userController.deleteUser);
