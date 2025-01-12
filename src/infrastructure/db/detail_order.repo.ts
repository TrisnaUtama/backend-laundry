import type { IDetailOrder, ILogger } from "../entity/interface";
import {
	TYPES,
	type CreateDetailOrder,
	type UpdateDetailOrder,
} from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class DetailOrderRepository implements IDetailOrder {
	private logger: ILogger;

	constructor(@inject(TYPES.logger) logger: ILogger) {
		this.logger = logger;
	}
	async getAll() {
		try {
			const detail_orders = await prisma.detail_Order.findMany();
			return detail_orders;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("error while accesing DB order");
		}
	}

	async getOne(id: string) {
		try {
			const detail_order = await prisma.detail_Order.findUnique({
				where: { detail_order_id: id },
			});
			return detail_order;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("error while accesing DB order");
		}
	}

	async create(data: CreateDetailOrder) {
		try {
			const new_detail_order = await prisma.detail_Order.create({ data });
			return new_detail_order;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("error while accesing DB order");
		}
	}

	async update(id: string, data: UpdateDetailOrder) {
		try {
			const updated_detail_order = await prisma.detail_Order.update({
				where: { detail_order_id: id },
				data,
			});
			return updated_detail_order;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("error while accesing DB order");
		}
	}

	async delete(id: string) {
		try {
			await prisma.detail_Order.delete({ where: { detail_order_id: id } });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("error while accesing DB order");
		}
	}
}
