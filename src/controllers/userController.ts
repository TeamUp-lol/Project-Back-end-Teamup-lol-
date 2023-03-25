import { Request, Response, NextFunction } from "express";

import { UserService } from "../services/userService";
import { CustomError } from "../utils/customError";
import { CustomRequest } from "../middlewares/authMiddleware";

export interface UserSignUp {
	email: string;
	password: string;
	nickname: string;
}

export interface UserSignIn {
	email: string;
	password: string;
}

export interface UserOAuth {
	code: string;
	identifier: string;
	state: string;
}

export interface UserUpdate {
	email: string;
	password: string;
	nickname: string
}

export class UserController {
	constructor(private userService: UserService) {
		this.signupUser = this.signupUser.bind(this);
		this.signinUser = this.signinUser.bind(this);
		this.userOAuth = this.userOAuth.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
	}

	async signupUser(req: Request, res: Response, next: NextFunction): Promise<Response | never | void> {
		try {
			const userSignUpForm: UserSignUp = req.body
			const { email, password, nickname } = userSignUpForm;
	
			if (!email || !password || !nickname) throw new CustomError("입력값을 확인해 주세요.", 401);
			
			await this.userService.signupUser(userSignUpForm)
	
			return res.status(201).json({ message: "회원가입이 완료되었습니다." });
		} catch (err) {
			next(err);
		}

	}

	async signinUser(req: Request, res: Response, next: NextFunction): Promise<Response | never | void> {
		try {
			const userSignInForm: UserSignIn = req.body;
			const { email, password } = userSignInForm; 
	
			if (!email || ! password) throw new CustomError("입력값을 확인해 주세요.", 401);
	
			const accessToken: any = await this.userService.signinUser(userSignInForm);
	
			return res.status(201).json({ "accessToken": accessToken});
		} catch(err) {
			next(err);
		}
	}

	async userOAuth(req: Request, res: Response, next: NextFunction): Promise<Response | never | void> {
		try {
			const { code, identifier, state }: UserOAuth = req.body

			if (!code || !identifier || !state) throw new CustomError("입력값을 확인해 주세요.", 401);
	
			const accessToken = await this.userService.userOAuth(code, identifier, state);
	
			return res.status(201).json({ "accessToken": accessToken });
		} catch(err) {
			next(err);
		}
	}

	async updateUser(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | never | void> {
		try {
			const userId = req.userId;
			const { email, nickname, password }: UserUpdate = req.body;
	
			if (!userId) throw new CustomError("올바르지 않은 접근입니다. 로그인을 해주세요.", 403);
	
			if(!email || !nickname || !password) throw new CustomError("입력값을 확인해 주세요.", 401);
	
			await this.userService.updateUser(email, nickname, password, userId);
	
			return res.status(201).json({ message: "계정이 업데이트 되었습니다."});
		} catch(err) {
			next(err);
		}
	}

	async deleteUser(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | never | void> {
		try {
			const userId = req.userId;
			const requestDate = (req.body as { requestDate: Date }).requestDate
	
			if (!userId) throw new CustomError("올바르지 않은 접근입니다. 로그인을 해주세요.", 403);
			if(!requestDate) throw new CustomError("입력값을 확인해 주세요.", 401);
	
			await this.userService.deleteUser(userId, requestDate);
	
			return res.status(201).json({ message: "계정이 삭제되었습니다."});
		} catch(err) {
			next(err)
		}
	}
}
