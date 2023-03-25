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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../../.env")
});
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_1 = require("../../utils/customError");
class OAuth {
    constructor(code, identifier, state) {
        this.REDIRECT_URL = process.env.REDIRECT_URL;
        this.code = code;
        this.identifier = identifier;
        this.state = state;
    }
    handleIdentifiers() {
        if (this.identifier === "GOOGLE")
            return this.googleOAuth();
        if (this.identifier === "KAKAO")
            return this.kakaoOAuth();
    }
    googleOAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GOOGLE_CLIENT_KEY = process.env.GOOGLE_CLIENT_KEY;
                const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY;
                const GOOGLE_URL = "GOOGLE";
                const { id_token } = yield this.requestAccessToken(this.code, GOOGLE_URL, GOOGLE_CLIENT_KEY, GOOGLE_SECRET_KEY, this.state);
                const { email, name, iss } = jsonwebtoken_1.default.decode(id_token);
                const socialId = 2;
                return { name, email, iss, socialId };
            }
            catch (_a) {
                throw new customError_1.CustomError("O Auth 인증 실패", 404);
            }
        });
    }
    kakaoOAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const KAKAO_CLIENT_KEY = process.env.KAKAO_CLIENT_KEY;
                const KAKAO_SECRET_KEY = process.env.KAKAO_SECRET_KEY;
                const KAKAO_URL = "https://kauth.kakao.com/oauth/token";
                const { id_token } = yield this.requestAccessToken(this.code, KAKAO_URL, KAKAO_CLIENT_KEY, KAKAO_SECRET_KEY, this.state);
                const { email, nickname, iss } = jsonwebtoken_1.default.decode(id_token);
                const name = nickname;
                const socialId = 1;
                return { name, email, iss, socialId };
            }
            catch (_a) {
                throw new customError_1.CustomError("O Auth 인증 실패", 404);
            }
        });
    }
    naverOAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const NAVER_CLIENT_KEY = process.env.NAVER_CLIENT_KEY;
                const NAVER_SECRET_KEY = process.env.NAVER_SECRET_KEY;
                const NAVER_URL = "https://kauth.kakao.com/oauth/token";
                const { id_token } = yield this.requestAccessToken(this.code, NAVER_URL, NAVER_CLIENT_KEY, NAVER_SECRET_KEY, this.state);
                const { email, nickname, iss } = jsonwebtoken_1.default.decode(id_token);
                const name = nickname;
                const socialId = 1;
                return { name, email, iss, socialId };
            }
            catch (_a) {
                throw new customError_1.CustomError("O Auth 인증 실패", 404);
            }
        });
    }
    requestAccessToken(code, url, clientKey, secretKey, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, axios_1.default)({
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                params: {
                    "client_id": clientKey,
                    "client_secret": secretKey,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": this.REDIRECT_URL,
                    "state": state
                }
            }).then((res) => {
                return res.data;
            }).catch(() => {
                throw new customError_1.CustomError("연결 실패", 404);
            });
            return res;
        });
    }
}
exports.OAuth = OAuth;
