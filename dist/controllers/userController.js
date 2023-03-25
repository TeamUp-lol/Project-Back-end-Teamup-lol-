"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const customError_1 = require("../utils/customError");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.signupUser = this.signupUser.bind(this);
        this.signinUser = this.signinUser.bind(this);
        this.userOAuth = this.userOAuth.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    signupUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSignUpForm = req.body;
                const { email, password, nickname } = userSignUpForm;
                if (!email || !password || !nickname)
                    throw new customError_1.CustomError("입력값을 확인해 주세요.", 401);
                yield this.userService.signupUser(userSignUpForm);
                return res.status(201).json({ message: "회원가입이 완료되었습니다." });
            }
            catch (err) {
                next(err);
            }
        });
    }
    signinUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSignInForm = req.body;
                const { email, password } = userSignInForm;
                if (!email || !password)
                    throw new customError_1.CustomError("입력값을 확인해 주세요.", 401);
                const accessToken = yield this.userService.signinUser(userSignInForm);
                return res.status(201).json({ "accessToken": accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
    userOAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, identifier, state } = req.body;
                if (!code || !identifier || !state)
                    throw new customError_1.CustomError("입력값을 확인해 주세요.", 401);
                const accessToken = yield this.userService.userOAuth(code, identifier, state);
                return res.status(201).json({ "accessToken": accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { email, nickname, password } = req.body;
                if (!userId)
                    throw new customError_1.CustomError("올바르지 않은 접근입니다. 로그인을 해주세요.", 403);
                if (!email || !nickname || !password)
                    throw new customError_1.CustomError("입력값을 확인해 주세요.", 401);
                yield this.userService.updateUser(email, nickname, password, userId);
                return res.status(201).json({ message: "계정이 업데이트 되었습니다." });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const requestDate = req.body.requestDate;
                if (!userId)
                    throw new customError_1.CustomError("올바르지 않은 접근입니다. 로그인을 해주세요.", 403);
                if (!requestDate)
                    throw new customError_1.CustomError("입력값을 확인해 주세요.", 401);
                yield this.userService.deleteUser(userId, requestDate);
                return res.status(201).json({ message: "계정이 삭제되었습니다." });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.UserController = UserController;
