import path from "path";
import dotenv from "dotenv";

import jwt, { JwtPayload } from "jsonwebtoken"

dotenv.config({
	path: path.resolve(__dirname, "../../../.env")
})

export const signToken = (userId: number): string => {
	return jwt.sign({ userId: userId }, process.env.JWTSecretKey!);
}

export const decodeToken = (token: string): JwtPayload | any => {
	return jwt.verify(token, process.env.JWTSecretKey!);
}
