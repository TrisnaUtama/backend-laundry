import { Elysia, t } from "elysia";
import { addressServices } from "../../application/instance";
import { JWT_NAME } from "../../constant/constant";
import jwt from "@elysiajs/jwt";
import { authServices } from "../../application/instance";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import type { IJwtPayload } from "../../infrastructure/entity/interface";

export const addressRouter = new Elysia({ prefix: "/v1/address" })
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
	.get("/user/:id", async ({ set, user }) => {
		try {
			const address = await addressServices.getAll(user.user_id);
			set.status = 200;
			return address;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing route address");
		}
	})
	.get("/:id", async ({ set, user }) => {
		try {
			const address = await addressServices.getOne(user.user_id);
			set.status = 200;
			return address;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing route address");
		}
	})
	.post(
		"/",
		async ({ body, set, user }) => {
			try {
				const data = {
					address: body.address,
					user_id: user.user_id,
				};
				const new_address = await addressServices.create(data);
				set.status = 201;
				return new_address;
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong when accessing route address");
			}
		},
		{
			body: t.Object({
				address: t.String(),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ body, set, params }) => {
			try {
				const updated_address = await addressServices.update(params.id, body);

				set.status = 201;
				return updated_address;
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong when accessing route address");
			}
		},
		{
			body: t.Object({
				address: t.String(),
			}),
		},
	)
	.delete("/:id", async ({ user, set }) => {
		try {
			await addressServices.delete(user.user_id);

			set.status = 204;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong when accessing route address");
		}
	});
