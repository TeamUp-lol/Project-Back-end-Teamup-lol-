"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("../services/utils/jsonwebtoken");
const customError_1 = require("../utils/customError");
const verifyToken = (req, _, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            throw new customError_1.CustomError("토큰이 없습니다", 401);
        const decoded = (0, jsonwebtoken_1.decodeToken)(token);
        if (!decoded)
            throw new customError_1.CustomError("토큰 분해에 실패하였습니다", 401);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.verifyToken = verifyToken;
