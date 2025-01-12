import { Elysia, t } from "elysia";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import jwt from "@elysiajs/jwt";
import {
	addressServices,
	authServices,
	userServices,
} from "../../application/instance";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import type { IJwtPayload } from "../../infrastructure/entity/interface";

export const userRouter = new Elysia({ prefix: "/v1/users" })
	.use(
		jwt({
			name: JWT_NAME,
			secret: `${process.env.JWT_SECRET}`,
		}),
	)
	.derive(async ({ cookie: { access_token }, set }) => {
		if (!access_token.value) {
			set.status = 401;
			throw new Error("Unauthorized");
		}
		const jwtPayload: IJwtPayload = verifyJwt(access_token.value.toString());

		if (!jwtPayload) {
			set.status = 403;
			throw new Error("Forbidden");
		}

		const userId = jwtPayload.user_id;
		if (!userId) throw new Error("invalid payload !");
		const user = await authServices.decodeUser(userId.toString());
		if (!user) {
			set.status = 403;
			throw new Error("Forbidden");
		}

		return {
			user,
		};
	})
	.get("/", async ({ set }) => {
		try {
			const users = await userServices.getAll();
			if (!users) {
				set.status = 400;
				throw new Error("server cannot process your request");
			}

			set.status = 200;
			return users;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing user route");
		}
	})
	.get("/:id", async ({ set, params }) => {
		try {
			const user = await userServices.getOne(params.id);
			if (!user) {
				set.status = 400;
				throw new Error("server cannot process your request");
			}

			set.status = 200;
			return user;
		} catch (error) {
			set.status = 500;
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing user route");
		}
	})
	.post("/logout/:id", async ({ set, params }) => {
		try {
			const logout = {
				isOnline: false,
				refresh_token: null,
			};
			await authServices.logout(params.id, logout);

			set.status = 200;
			return { message: "Logout successful" };
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing user route");
		}
	})
	.patch(
		"/:id",
		async ({ set, body, params }) => {
			try {
				const updated_profile = await userServices.update(params.id, body);

				if (!updated_profile) {
					set.status = 400;
					throw new Error("server cannot process your request !");
				}

				set.status = 200;
				return updated_profile;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong when accessing user route ");
			}
		},
		{
			body: t.Partial(
				t.Object({
					name: t.String(),
					email: t.String(),
					password: t.String(),
					phone_number: t.String(),
					is_verified: t.Boolean(),
					status: t.Boolean(),
				}),
			),
		},
	)
	.delete("/:id", async ({ set, params }) => {
		try {
			await userServices.delete(params.id);
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing user route");
		}
	});
