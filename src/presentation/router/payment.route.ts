import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import type {
	UpdateOrder,
	UpdatePayment,
} from "../../infrastructure/entity/types";
import { authServices, paymentServices } from "../../application/instance";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import { Payment_Method, Payment_Status } from "@prisma/client";

export const paymentRouter = new Elysia({ prefix: "/v1/payments" })
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
			const payments = await paymentServices.getAll();
			if (!payments) {
				set.status = 400;
				throw new Error("server cannot process your request !");
			}
			set.status = 200;
			return payments;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("error while accessing payments routes");
		}
	})
	.get("/:id", async ({ set, params }) => {
		try {
			const paymentS = await paymentServices.getOne(params.id);
			if (!paymentS) {
				set.status = 400;
				throw new Error("server cannot process your request !");
			}
			set.status = 200;
			return paymentS;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("error while accessing payments routes");
		}
	})
	.patch(
		"/:id",
		async ({ params, set, body }) => {
			try {
				const updatedData: UpdatePayment = {
					order_id: body?.order_id,
					payment_method: body?.payment_method,
					payment_status: body?.payment_status,
				};

				const updated_payment = await paymentServices.update(
					params.id,
					updatedData,
				);

				set.status = 201;
				return updated_payment;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("error while accessing order routes");
			}
		},
		{
			body: t.Optional(
				t.Object({
					order_id: t.Optional(t.String()),
					payment_method: t.Optional(t.Enum(Payment_Method)),
					payment_status: t.Optional(t.Enum(Payment_Status)),
				}),
			),
		},
	)
	.patch(
		"user/:id",
		async ({ params, set, body }) => {
			try {
				const updatedData: UpdatePayment = {
					order_id: body?.order_id,
					payment_method: body?.payment_method,
				};

				const orderData: UpdateOrder = {
					delivery_address: body?.delivery_address,
					delivery_date: body?.delivery_date
						? new Date(body.delivery_date)
						: undefined,
				};

				const updated_payment = await paymentServices.userPaid(
					params.id,
					updatedData,
					orderData,
				);

				set.status = 201;
				return updated_payment;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("error while accessing order routes");
			}
		},
		{
			body: t.Optional(
				t.Object({
					order_id: t.Optional(t.String()),
					payment_method: t.Optional(t.Enum(Payment_Method)),
					delivery_address: t.Optional(t.String()),
					delivery_date: t.Optional(t.String()),
				}),
			),
		},
	);
