import jwt from "jsonwebtoken";
import type { IJwtPayload } from "../entity/interface";

export const signJwt = (payload: IJwtPayload, expiresIn: number) => {
	return jwt.sign(
		{ ...payload, sub: payload.user_id },
		process.env.JWT_SECRET_KEY as string,
		{ expiresIn },
	);
};

export const decodeJwt = (token: string) => {
	try {
		const decoded = jwt.decode(token, { complete: true });
		return decoded;
	} catch (error) {
		console.error("Error decoding JWT:", error);
		throw new Error("Invalid JWT token");
	}
};

export const verifyJwt = (token: string): IJwtPayload => {
	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET_KEY as string,
		) as IJwtPayload;
		return decoded;
	} catch (error) {
		console.error("Error verifying JWT:", error);
		throw new Error("Invalid JWT token");
	}
};
