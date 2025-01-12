import { Prisma } from "@prisma/client";
import type { ILogger, IUser } from "../entity/interface";
import { TYPES, type CreateUser, type UpdateUser } from "../entity/types";
import { prisma } from "../utils/prisma";
import { DBError } from "../entity/errors";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class UserRepository implements IUser {
	private logger: ILogger;

	constructor(@inject(TYPES.logger) logger: ILogger) {
		this.logger = logger;
	}

	async getAll() {
		try {
			const users = await prisma.user.findMany({
				where: {
					role: "User",
				},
			});
			return users;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
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
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB user");
		}
	}

	async create(data: CreateUser) {
		try {
			const user = await prisma.user.create({
				data,
			});
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
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
					status: data.status,
					refresh_token: data.refresh_token,
					isOnline: data.isOnline,
					is_verified: data.is_verified,
					created_at: new Date(),
				},
			});
			return updatedUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
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
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB user");
		}
	}
}
