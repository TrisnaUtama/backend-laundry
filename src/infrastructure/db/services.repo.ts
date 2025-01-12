import {
	TYPES,
	type CreateServices,
	type UpdateServices,
} from "../entity/types";
import type { ILogger, IService } from "../entity/interface";
import { DBError } from "../entity/errors";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import "reflect-metadata";
import { injectable, inject } from "inversify";

injectable();
export class ServicesRepository implements IService {
	private logger: ILogger;

	constructor(@inject(TYPES.logger) logger: ILogger) {
		this.logger = logger;
	}

	async getAll() {
		try {
			const services = await prisma.service.findMany();
			return services;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB service");
		}
	}

	async getOne(idOrName: string) {
		try {
			const service = await prisma.service.findFirst({
				where: {
					OR: [
						{ service_id: idOrName },
						{ name: idOrName },
						{ item_type_id: idOrName },
					],
				},
			});
			return service;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB service");
		}
	}

	async create(data: CreateServices) {
		try {
			const new_service = await prisma.service.create({ data });
			return new_service;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB service");
		}
	}

	async update(id: string, data: UpdateServices) {
		try {
			const updated_service = await prisma.service.update({
				where: { service_id: id },
				data,
			});

			return updated_service;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB service");
		}
	}

	async delete(id: string) {
		try {
			await prisma.service.delete({ where: { service_id: id } });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB service");
		}
	}
}
