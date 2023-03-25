"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRoutes = void 0;
const express_1 = require("express");
const userRoutes_1 = require("./userRoutes");
exports.indexRoutes = (0, express_1.Router)();
exports.indexRoutes.use("/users", userRoutes_1.userRoutes);
