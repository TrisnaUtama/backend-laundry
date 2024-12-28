import { Elysia, t } from "elysia";
import { JWT_NAME } from "../../constant/constant";
import jwt from "@elysiajs/jwt";
import { authServices, userServices } from "../../application/instance";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import type { IJwtPayload } from "../../infrastructure/entity/interface";

export const userRouter = new Elysia({ prefix: "/v1/user" })
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
	.post(
		"/logout",
		async ({ set, cookie: { access_token, refresh_token }, user }) => {
			try {
				access_token.remove();
				refresh_token.remove();

				const logout = {
					isOnline: false,
					refresh_token: null,
				};

				set.status = 204;
				await authServices.logout(user.user_id, logout);
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong when accessing user route");
			}
		},
	)
	.patch(
		"/:id",
		async ({ set, body, user }) => {
			try {
				const updated_profile = await userServices.update(user.user_id, body);

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
			body: t.Object({
				name: t.String(),
				email: t.String(),
				password: t.String(),
				phone_number: t.String(),
			}),
		},
	);
