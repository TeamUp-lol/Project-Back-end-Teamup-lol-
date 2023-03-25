import { Request, NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken"

import { decodeToken } from "../services/utils/jsonwebtoken";
import { CustomError } from "../utils/customError";

export interface CustomRequest extends Request {
	userId?: number;
}


export const verifyToken = (req: CustomRequest, _: Response, next: NextFunction): void | never | Response => {
  try {
    const token = req.headers.authorization;

    if (!token) throw new CustomError("토큰이 없습니다", 401);

    const decoded: JwtPayload = decodeToken(token!);

    if (!decoded) throw new CustomError("토큰 분해에 실패하였습니다", 401);

    req.userId = decoded.userId;

    next();
  } catch (err: any) {
    next(err);
  }
}
