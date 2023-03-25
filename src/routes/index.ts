import { Router } from "express";

import { userRoutes } from "./userRoutes";

export const indexRoutes = Router();

indexRoutes.use("/users", userRoutes);
