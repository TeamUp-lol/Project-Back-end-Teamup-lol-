import path from "path";
import dotenv from "dotenv";

import express, { Express, Response, Request, Router } from "express";
import cors from "cors";
import morgan from "morgan";
import { DataSource } from "typeorm";

import { appDataSource } from "./database/database";
import { indexRoutes } from "./routes";
import { globalErrorHandler } from "./middlewares/errorHandlingMiddleware";

dotenv.config({
	path: path.resolve(__dirname, "../.env")
});


export class App {
	private _app: Express;
	private _PORT: string;
	private _appDataSource: DataSource;
	private _indexRoutes: Router;

	get app() {
		return this._app;
	}

	constructor() {
		this._app = express();
		this._PORT = process.env.PORT as string;
		this._appDataSource = appDataSource
		this._indexRoutes = indexRoutes;
		this.configApp();
		this.connectDBAndCreateServer();
		this.healthCheck();
	}

	configApp() {
		this._app.use(cors());
		this._app.use(morgan("tiny"));
		this._app.use(express.json());
		this._app.use(this._indexRoutes);
		this._app.use(globalErrorHandler);
	}

	createServer() {
		this._app.listen(this._PORT, () => {
			console.log(`Server is Listening on ${this._PORT}`)
		});
	}

	async connectDBAndCreateServer() {
		try {
			await this._appDataSource.initialize().then(() => {
				console.log(`Database is Conneted!`);
			});
	
			this.createServer();
		} catch(err) {
			console.log(err);
		}
	}

	healthCheck() {
		this._app.get("/ping", async (_: Request, res: Response) => {
			res.json({ message: "pong" });
		});
	}
}

new App();