import { DBError } from "../entity/errors";
import type { IEmployee, IUser } from "../entity/interface";
import type { CreateEmployee, CreateUser, UpdateUser } from "../entity/types";
import { prisma } from "../utils/prisma";
import { Prisma, Role } from "@prisma/client";

export class EmployeeRepository implements IEmployee {
	async getAll() {
		try {
			const employees = await prisma.user.findMany({
				where: {
					OR: [{ role: Role.Admin }, { role: Role.Staff }],
				},
			});

			return employees;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accessing DB employee");
		}
	}

	async getOne(id: string) {
		try {
			const employee = await prisma.user.findUnique({
				where: {
					user_id: id,

					OR: [{ role: Role.Admin }, { role: Role.Staff }],
				},
			});

			return employee;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accessing DB employee");
		}
	}

	async create(data: CreateEmployee) {
		try {
			const new_employee = await prisma.user.create({
				data,
			});

			return new_employee;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accessing DB employee");
		}
	}

	async update(id: string, data: UpdateUser) {
		try {
			const updated_employee = await prisma.user.update({
				where: {
					user_id: id,
				},
				data,
			});

			return updated_employee;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accessing DB employee");
		}
	}

	async delete(id: string) {
		try {
			await prisma.user.delete({
				where: {
					user_id: id,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accessing DB employee");
		}
	}
}
