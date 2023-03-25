import bcrypt from "bcrypt";

export const encodePassword = async(password: string): Promise<string | never> => {
	const saltRound = 12;
	return await bcrypt.hash(password, saltRound);
};

export const verifyPasswords = async(password: string, hashedPassword: string): Promise<boolean | never> => {
	return await bcrypt.compare(password, hashedPassword);
};
