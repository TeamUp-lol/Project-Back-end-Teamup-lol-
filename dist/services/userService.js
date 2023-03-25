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
exports.UserService = void 0;
const bcrypt_1 = require("../utils/bcrypt");
const customError_1 = require("../utils/customError");
const jsonwebtoken_1 = require("./utils/jsonwebtoken");
const oAuth_1 = require("./utils/oAuth");
class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    signupUser(userSignUpForm) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, nickname } = userSignUpForm;
            const isUser = yield this.isUser(email);
            if (isUser)
                throw new customError_1.CustomError("이미 존재하는 계정입니다", 401);
            const hashedPassword = yield (0, bcrypt_1.encodePassword)(password);
            yield this.userModel.signupUser(email, hashedPassword, nickname);
        });
    }
    signinUser(userSignInForm) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userSignInForm;
            const [userInfo] = yield this.userModel.signinUser(email);
            if (!userInfo || userInfo.deletedBy)
                throw new customError_1.CustomError("가입되어 있지 않은 계정입니다", 401);
            const { userId, hashedPassword } = userInfo;
            const passwordsAreEqaul = yield (0, bcrypt_1.verifyPasswords)(password, hashedPassword);
            if (!passwordsAreEqaul)
                throw Error;
            const accessToken = yield (0, jsonwebtoken_1.signToken)(userId);
            return accessToken;
        });
    }
    userOAuth(code, identifier, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const oAuth = new oAuth_1.OAuth(code, identifier, state);
            const { name, email, iss, socialId } = yield oAuth.handleIdentifiers();
            const result = yield this.userModel.userOAuth(name, email, iss, socialId);
            const userId = result.insertId;
            const accessToken = yield (0, jsonwebtoken_1.signToken)(userId);
            return accessToken;
        });
    }
    updateUser(email, nickname, password, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUser = yield this.isUser(email);
            if (!isUser)
                throw new customError_1.CustomError("가입되어 있지 않은 계정입니다", 401);
            const hashedPassword = yield (0, bcrypt_1.encodePassword)(password);
            yield this.userModel.updateUser(email, nickname, hashedPassword, userId);
        });
    }
    deleteUser(userId, requestDate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userModel.deleteUser(userId, requestDate);
        });
    }
    isUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [userData] = yield this.userModel.getUserData(email);
            if (!userData || !!userData.deleted_by)
                return false;
            return true;
        });
    }
}
exports.UserService = UserService;
