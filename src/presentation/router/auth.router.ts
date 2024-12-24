import { Elysia, t } from "elysia";
import { authServices } from "../../application/instance";

export const authRouter = new Elysia({ prefix: "/v1" }).post(
	"/register",
	async ({ body, set }) => {
		console.log("Received body:", body);
		try {
			const newUser = await authServices.registerUser(body);
			set.status = 201;
			return newUser;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something went wrong in route register");
		}
	},
	{
		body: t.Object({
			name: t.String(),
			email: t.String(),
			password: t.String(),
			phone_number: t.String(),
		}),
	},
);
