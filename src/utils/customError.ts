export interface customErrorInterface extends Error {
	statusCode?: number;
}

export class CustomError implements customErrorInterface {
	public name: string
	public message: string
	public statusCode?: number;
	public error: customErrorInterface;

	constructor(message: string, statusCode?: number) {
		this.name = "Error";
		this.message = message;
		this.statusCode = statusCode;
		this.error = new Error();
		this.error.message = this.message; 
		this.error.statusCode = this.statusCode;
		
		throw this.error;
	}
}