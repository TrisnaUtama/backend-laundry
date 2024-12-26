export class DBError extends Error {
	public status: number;
	public code: string;

	constructor(message: string) {
		super(message);
		this.status = 500;
		this.code = "Internal Server Error";
	}
}

export class AuthorizationError extends Error {
	public status: number;
	public code: string;

	constructor(message: string) {
		super(message);
		this.status = 404;
		this.code = "Unauthorized";
	}
}
