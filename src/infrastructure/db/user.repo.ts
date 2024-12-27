import { Prisma } from "@prisma/client";
import type { IEmployee } from "../entity/interface";
import type { CreateEmployee, UpdateUser } from "../entity/types";
import { prisma } from "../utils/prisma";
import { DBError } from "../entity/errors";

export class UserRepository implements IEmployee {
	async getAll() {
		try {
			const users = await prisma.user.findMany();
			return users;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB user");
		}
	}

	async getOne(idOrEmail: string) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					OR: [{ user_id: idOrEmail }, { email: idOrEmail }],
				},
			});

			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError(
				"something went wrong while getting specific user in DB user",
			);
		}
	}

	async create(data: CreateEmployee) {
		try {
			const user = await prisma.user.create({
				data,
			});
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB user");
		}
	}

	async update(id: string, data: UpdateUser) {
		try {
			const updatedUser = await prisma.user.update({
				where: {
					user_id: id,
				},
				data: {
					email: data.email,
					name: data.name,
					phone_number: data.phone_number,
					refresh_token: data.refresh_token,
					isOnline: data.isOnline,
					is_verified: data.is_verified,
					created_at: new Date(),
				},
			});
			return updatedUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB user");
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
			throw new DBError("something went wrong while accesing DB user");
		}
	}
}
