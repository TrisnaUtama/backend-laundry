import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import type { UpdateDetailOrder } from "../../infrastructure/entity/types";
import { authServices, detailOrderServices } from "../../application/instance";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import { Decimal } from "@prisma/client/runtime/library";

export const detailOrderRouter = new Elysia({ prefix: "/v1/detail-orders" })
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
			const detail_orders = await detailOrderServices.getAll();
			if (!detail_orders) {
				set.status = 400;
				throw new Error("server cannot process your request !");
			}
			set.status = 200;
			return detail_orders;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("error while accessing detail order routes");
		}
	})
	.get("/:id", async ({ set, params }) => {
		try {
			const detail_order = await detailOrderServices.getOne(params.id);
			if (!detail_order) {
				set.status = 400;
				throw new Error("server cannot process your request !");
			}
			set.status = 200;
			return detail_order;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("error while accessing detail order routes");
		}
	})
	.patch(
		"/:id",
		async ({ params, set, body }) => {
			try {
				const updatedData: UpdateDetailOrder = {
					item_id: body?.item_id,
					service_id: body?.service_id,
					order_id: body?.order_id,
					weight: new Decimal(
						Number.parseFloat(body?.weight?.toString() || "0"),
					),
				};

				const updated_order = await detailOrderServices.update(
					params.id,
					updatedData,
				);

				set.status = 201;
				return updated_order;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("error while accessing detail order routes");
			}
		},
		{
			body: t.Optional(
				t.Object({
					order_id: t.Optional(t.String()),
					item_id: t.Optional(t.String()),
					service_id: t.Optional(t.String()),
					weight: t.Number(),
				}),
			),
		},
	);
