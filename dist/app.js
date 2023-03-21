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
exports.App = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./database/database");
const routes_1 = require("./routes");
const errorHandlingMiddleware_1 = require("./middlewares/errorHandlingMiddleware");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env")
});
class App {
    get app() {
        return this._app;
    }
    constructor() {
        this._app = (0, express_1.default)();
        this._PORT = process.env.PORT;
        this._appDataSource = database_1.appDataSource;
        this._indexRoutes = routes_1.indexRoutes;
        this.configApp();
        this.connectDBAndCreateServer();
        this.healthCheck();
    }
    configApp() {
        this._app.use((0, cors_1.default)());
        this._app.use((0, morgan_1.default)("tiny"));
        this._app.use(express_1.default.json());
        this._app.use(this._indexRoutes);
        this._app.use(errorHandlingMiddleware_1.globalErrorHandler);
    }
    createServer() {
        this._app.listen(this._PORT, () => {
            console.log(`Server is Listening on ${this._PORT}`);
        });
    }
    connectDBAndCreateServer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._appDataSource.initialize().then(() => {
                    console.log(`Database is Conneted!`);
                });
                this.createServer();
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    healthCheck() {
        this._app.get("/ping", (_, res) => __awaiter(this, void 0, void 0, function* () {
            res.json({ message: "pong" });
        }));
    }
}
exports.App = App;
new App();
