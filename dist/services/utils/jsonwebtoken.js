"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.signToken = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../../.env")
});
const signToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWTSecretKey);
};
exports.signToken = signToken;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWTSecretKey);
};
exports.decodeToken = decodeToken;
