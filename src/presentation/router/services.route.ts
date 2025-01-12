import jwt from "@elysiajs/jwt";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import type {
	CreateServices,
	UpdateServices,
} from "../../infrastructure/entity/types";
import { Elysia, t } from "elysia";
import { authServices, services } from "../../application/instance";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import { Decimal } from "@prisma/client/runtime/library";

export const serviceRouter = new Elysia({ prefix: "/v1/services" })
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

		if (jwtPayload.role === "Staff") {
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
			const item_types = await services.getAll();

			if (!item_types) {
				set.status = 400;
				throw new Error("server cannot process your request");
			}

			set.status = 200;
			return item_types;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong while accesing services routes");
		}
	})
	.get("/:id", async ({ params, set }) => {
		try {
			const employee = await services.getOne(params.id);
			if (!employee) {
				set.status = 400;
				throw new Error("server cannot process your request !");
			}

			set.status = 200;
			return employee;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong while accesing services routes");
		}
	})
	.post(
		"/",
		async ({ body, set }) => {
			try {
				const new_services: CreateServices = {
					item_type_id: body.item_type_id,
					description: body.description,
					name: body.name,
					estimated_hours: body.estimated_hours,
					price: new Decimal(Number.parseFloat(body.price.toString())),
				};
				const new_item_type = await services.create(new_services);
				if (!new_item_type) {
					set.status = 400;
					throw new Error("server cannot process your request !");
				}

				set.status = 201;
				return new_item_type;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong while accesing services routes");
			}
		},
		{
			body: t.Object({
				item_type_id: t.String(),
				name: t.String(),
				description: t.String(),
				price: t.Number(),
				estimated_hours: t.Number(),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ set, params, body }) => {
			try {
				const updated_service: UpdateServices = {
					item_type_id: body.item_type_id,
					description: body.description,
					name: body.name,
					status: body.status,
					estimated_hours: body.estimated_hours,
					price: body.price
						? new Decimal(Number.parseFloat(body.price.toString()))
						: new Decimal(0),
				};
				const updated_item_type = await services.update(
					params.id,
					updated_service,
				);
				if (!updated_item_type) {
					set.status = 400;
					throw new Error("server cannot process your request");
				}

				set.status = 201;
				return updated_item_type;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong while accesing services routes");
			}
		},
		{
			body: t.Partial(
				t.Object({
					item_type_id: t.String(),
					name: t.String(),
					description: t.String(),
					price: t.Number(),
					estimated_hours: t.Number(),
					status: t.Boolean(),
				}),
			),
		},
	)
	.delete("/:id", async ({ set, params }) => {
		try {
			await services.delete(params.id);
			set.status = 204;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong while accesing services routes");
		}
	});
