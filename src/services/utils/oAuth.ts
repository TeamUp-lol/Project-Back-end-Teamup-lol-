import path from "path";
import dotenv from "dotenv";

dotenv.config({
	path: path.resolve(__dirname, "../../../.env")
})

import axios from "axios";
import jwt from "jsonwebtoken";

import { CustomError } from "../../utils/customError";

interface AccessToken {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface ID_Token {
	email: string;
	name?: string;
	nickname?: string;
	iss: string;
}

export interface UserOAuthInfo {
	email: string;
	name: string;
	iss: string;
	socialId: number;
}


export class OAuth {
	private code: string;
	private identifier: string;
	private state: string;
	private REDIRECT_URL = process.env.REDIRECT_URL!;

	constructor(code: string, identifier: string, state: string) {
		this.code = code;
		this.identifier = identifier;
		this.state = state;
	}

	handleIdentifiers(): Promise<void | UserOAuthInfo | CustomError> | void {
		if (this.identifier === "GOOGLE") return this.googleOAuth();
		if (this.identifier === "KAKAO") return this.kakaoOAuth();
	}

	async googleOAuth(): Promise<UserOAuthInfo | void | never | CustomError> {
		try {
			const GOOGLE_CLIENT_KEY = process.env.GOOGLE_CLIENT_KEY!;
			const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY!;
			const GOOGLE_URL = "GOOGLE";

			const { id_token } = await this.requestAccessToken(this.code, GOOGLE_URL, GOOGLE_CLIENT_KEY, GOOGLE_SECRET_KEY, this.state);

			const { email, name, iss }  = jwt.decode(id_token) as unknown as ID_Token;
			const socialId = 2;
			
			return { name, email, iss, socialId } as UserOAuthInfo;
		} catch {
			throw new CustomError("O Auth 인증 실패", 404);
		}
	}

	async kakaoOAuth (): Promise<UserOAuthInfo | void | never | CustomError> {
		try {
			const KAKAO_CLIENT_KEY = process.env.KAKAO_CLIENT_KEY!;
			const KAKAO_SECRET_KEY = process.env.KAKAO_SECRET_KEY!;
			const KAKAO_URL = "https://kauth.kakao.com/oauth/token";
		
			const { id_token } = await this.requestAccessToken(this.code, KAKAO_URL, KAKAO_CLIENT_KEY, KAKAO_SECRET_KEY, this.state);

			const { email, nickname, iss } = jwt.decode(id_token) as unknown as ID_Token;
		
			const name = nickname;
			const socialId = 1;
		
			return { name, email, iss, socialId } as UserOAuthInfo;
		} catch {
			throw new CustomError("O Auth 인증 실패", 404);
		}
	}

	async naverOAuth (): Promise<UserOAuthInfo | void | never | CustomError> {
		try {
			const NAVER_CLIENT_KEY = process.env.NAVER_CLIENT_KEY!;
			const NAVER_SECRET_KEY = process.env.NAVER_SECRET_KEY!;
			const NAVER_URL = "https://kauth.kakao.com/oauth/token";
		
			const { id_token } = await this.requestAccessToken(this.code, NAVER_URL, NAVER_CLIENT_KEY, NAVER_SECRET_KEY, this.state);

			const { email, nickname, iss } = jwt.decode(id_token) as unknown as ID_Token;
		
			const name = nickname;
			const socialId = 1;
		
			return { name, email, iss, socialId } as UserOAuthInfo;
		} catch {
			throw new CustomError("O Auth 인증 실패", 404);
		}
	}

	async requestAccessToken (code: string, url: string, clientKey: string, secretKey: string, state: string): 
	Promise<AccessToken | never> {
		const res = await axios({
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
			throw new CustomError("연결 실패", 404);
		});
	
		return res;
	}
}


