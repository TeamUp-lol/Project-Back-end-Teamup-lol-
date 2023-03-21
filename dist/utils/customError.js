"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError {
    constructor(message, statusCode) {
        this.name = "Error";
        this.message = message;
        this.statusCode = statusCode;
        this.error = new Error(this.message);
        this.error.statusCode = this.statusCode;
        throw this.error;
    }
}
exports.CustomError = CustomError;
