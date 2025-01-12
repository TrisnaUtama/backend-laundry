import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import {
	addressServices,
	authServices,
	employeeServices,
} from "../../application/instance";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import { Role } from "@prisma/client";

export const employeeRouter = new Elysia({ prefix: "/v1/employees" })
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

		if (jwtPayload.role === "User" || jwtPayload.role === "Staff") {
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
			const employees = await employeeServices.getAll();

			if (!employees) {
				set.status = 400;
				throw new Error("server cannot process your request");
			}

			set.status = 200;
			return employees;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong while accesing employee routes");
		}
	})
	.get("/:id", async ({ params, set }) => {
		try {
			const employee = await employeeServices.getOne(params.id);
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
			throw new Error("something wrong while accesing employee routes");
		}
	})
	.post(
		"/",
		async ({ body, set }) => {
			try {
				const employee_data = {
					name: body.name,
					email: body.email,
					password: body.password,
					phone_number: body.phone_number,
					role: body.role,
				};
				const new_employee =
					await employeeServices.registerEmployee(employee_data);
				if (!new_employee) {
					set.status = 400;
					throw new Error("server cannot process your request !");
				}
				const address_data = {
					address: body.address,
					user_id: new_employee.user_id,
					is_default: true,
				};
				await addressServices.create(address_data);

				set.status = 200;
				return new_employee;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong while accesing employee routes");
			}
		},
		{
			body: t.Object({
				name: t.String(),
				email: t.String(),
				password: t.String(),
				phone_number: t.String(),
				address: t.String(),
				role: t.Enum(Role),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ body, set, params }) => {
			try {
				const employee_data = {
					name: body.name,
					email: body.email,
					password: body.password,
					phone_number: body.phone_number,
					role: body.role,
				};
				const updated_employee = await employeeServices.update(
					params.id,
					employee_data,
				);

				const address_data = {
					address: body.address,
					user_id: updated_employee.user_id,
				};

				if (!body.id_address) return null;

				await addressServices.update(body.id_address, address_data);

				if (!updated_employee) {
					set.status = 400;
					throw new Error("server cannot proccess your request !");
				}

				set.status = 201;
				return updated_employee;
			} catch (error) {
				set.status = 500;
				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("something wrong while accesing employee routes");
			}
		},
		{
			body: t.Partial(
				t.Object({
					name: t.String(),
					email: t.String(),
					password: t.String(),
					phone_number: t.String(),
					address: t.String(),
					role: t.Enum(Role),
					id_address: t.String(),
				}),
			),
		},
	)
	.delete("/:id", async ({ params, set }) => {
		try {
			await employeeServices.delete(params.id);
			set.status = 204;
		} catch (error) {
			set.status = 500;
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something wrong while accesing employee routes");
		}
	});
