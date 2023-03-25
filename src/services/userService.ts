import { UserSignIn, UserSignUp } from "../controllers/userController";
import { UserSigninInfo, UserModel, UserInfo } from "../models/userModel";
import { encodePassword, verifyPasswords } from "../utils/bcrypt";
import { CustomError } from "../utils/customError";
import { signToken } from "./utils/jsonwebtoken";
import { OAuth, UserOAuthInfo } from "./utils/oAuth";

export class UserService {
	constructor(private userModel: UserModel) {}

	async signupUser(userSignUpForm: UserSignUp): Promise<void | never> {
		const { email, password, nickname } = userSignUpForm;

		const isUser = await this.isUser(email);

		if (isUser) throw new CustomError("이미 존재하는 계정입니다", 401);

		const hashedPassword: string = await encodePassword(password);
		
		await this.userModel.signupUser(email, hashedPassword, nickname);
	}

	async signinUser(userSignInForm: UserSignIn): Promise<string | void | never> {
		const { email, password } = userSignInForm;
		
		const [ userInfo ]: UserSigninInfo[] = await this.userModel.signinUser(email);

		if (!userInfo || userInfo.deletedBy) throw new CustomError("가입되어 있지 않은 계정입니다", 401);
			
		const { userId, hashedPassword } = userInfo;


		const passwordsAreEqaul: boolean = await verifyPasswords(password, hashedPassword);

		if (!passwordsAreEqaul) throw Error;

		const accessToken: string = await signToken(userId);

		return accessToken;
	}

	async userOAuth(code: string, identifier: string, state: string): Promise<string | void | never> {
		const oAuth = new OAuth(code, identifier, state);
		const { name, email, iss, socialId } = await oAuth.handleIdentifiers() as UserOAuthInfo;

		const result = await this.userModel.userOAuth(name, email, iss, socialId);

		const userId = result.insertId;

		const accessToken: string = await signToken(userId);

		return accessToken;
	}

	async updateUser(email: string, nickname: string, password: string, userId: number) {
		const isUser = await this.isUser(email);

		if (!isUser) throw new CustomError("가입되어 있지 않은 계정입니다", 401);

		const hashedPassword: string = await encodePassword(password);

		await this.userModel.updateUser(email, nickname, hashedPassword, userId);
	}

	async deleteUser(userId: number, requestDate: Date) {
		await this.userModel.deleteUser(userId, requestDate);
	}

	async isUser(email: string): Promise<boolean> {
		const [ userData ]: UserInfo[] = await this.userModel.getUserData(email);

		if (!userData || !!userData.deleted_by) return false

		return true;
	}
}