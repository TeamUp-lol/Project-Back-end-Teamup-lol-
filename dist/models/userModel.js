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
exports.UserModel = void 0;
const database_1 = require("../database/database");
class UserModel {
    constructor() { }
    signupUser(email, hashedPassword, nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.appDataSource.query(`
				INSERT INTO users
					(email, password, nickname)
				VALUES
					(?, ?, ?);
		`, [email, hashedPassword, nickname]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    signinUser(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.appDataSource.query(`
				SELECT 
					id 							AS userId,
					email 					AS email,
					password 				AS hashedPassword,
					nickname 				AS nickname,
					social_id 			AS socialId,
					social_pk 			AS socialPk,
					created_at 			AS createdAt,
					deleted_by 			AS deletedBy
				FROM users
				WHERE email = ? AND deleted_by IS NULL;
		`, [userEmail]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    userOAuth(name, email, iss, socialId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.appDataSource.query(`
				INSERT INTO users
					(email, password, nickname)
				VALUES
					(?, ?, ?);
		`, [name, email, iss, socialId]);
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateUser(email, nickname, hashedpassword, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.appDataSource.query(`
			UPDATE users 
				SET 
					email = ?, 
					nickname = ?, 
					password = ?
			WHERE id = ${userId}
		`, [email, nickname, hashedpassword]);
        });
    }
    deleteUser(userId, requestDate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.appDataSource.query(`
			UPDATE users 
				SET deleted_by = ?
			WHERE id = ${userId};
		`, [requestDate]);
        });
    }
    getUserData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.appDataSource.query(`
			SELECT * FROM users
			WHERE email = ? AND deleted_by IS NULL;
		`, [email]);
        });
    }
}
exports.UserModel = UserModel;
