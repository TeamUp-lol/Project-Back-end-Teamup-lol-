import { appDataSource } from "../database/database";

export interface UserSigninInfo {
	userId: number;
	email: string;
	hashedPassword: string;
	nickname: string;
	socialId?: number;
	socialPK?: string;
	createdAt: Date;
	deletedBy: Date | null;
}

export interface UserInfo {
	id: number;
	email: string;
	password: string;
	nickname: string;
	social_id: number | null;
	social_pk?: string | null;
	created_at: Date;
	deleted_by: Date | null;
}

export class UserModel {
	constructor() {}
	
	async signupUser(email: string, hashedPassword: string, nickname: string): Promise<void> {
		try {
			await appDataSource.query(`
				INSERT INTO users
					(email, password, nickname)
				VALUES
					(?, ?, ?);
		`, [ email, hashedPassword, nickname ]);
		} 

		catch (err) {
			throw err;
		}
	}

	async signinUser(userEmail: string): Promise<UserSigninInfo[]> {
		try {
			return await appDataSource.query(`
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
		`, [ userEmail ]);
		} 

		catch(err) {
			throw err;
		}
	}

	async userOAuth(name: string, email: string, iss: string, socialId: number) {
		try {
			return await appDataSource.query(`
				INSERT INTO users
					(email, password, nickname)
				VALUES
					(?, ?, ?);
		`, [ name, email, iss, socialId ]);

		} catch(err) {
			throw err;
		}
	}

	async updateUser(email: string, nickname: string, hashedpassword: string, userId: number): Promise<void> {
		await appDataSource.query(`
			UPDATE users 
				SET 
					email = ?, 
					nickname = ?, 
					password = ?
			WHERE id = ${userId}
		`, [ email, nickname, hashedpassword ]);
	}

	async deleteUser(userId: number, requestDate: Date): Promise<void> {
		await appDataSource.query(`
			UPDATE users 
				SET deleted_by = ?
			WHERE id = ${userId};
		`, [ requestDate ]);
	}

	async getUserData(email: string): Promise<UserInfo[]> {
		return await appDataSource.query(`
			SELECT * FROM users
			WHERE email = ? AND deleted_by IS NULL;
		`, [ email ]
		);
	}
}