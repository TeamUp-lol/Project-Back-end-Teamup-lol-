"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userService_1 = require("../services/userService");
const userModel_1 = require("../models/userModel");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController = new userController_1.UserController(new userService_1.UserService(new userModel_1.UserModel()));
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.post("/signup", userController.signupUser);
exports.userRoutes.post("/signin", userController.signinUser);
exports.userRoutes.post("/oauth/success");
exports.userRoutes.get("/oauth/success");
exports.userRoutes.patch("", authMiddleware_1.verifyToken, userController.updateUser);
exports.userRoutes.delete("", authMiddleware_1.verifyToken, userController.deleteUser);
