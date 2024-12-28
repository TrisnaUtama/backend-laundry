import type { IItem_Type } from "../entity/interface";
import type { CreateItemType, UpdateItemType } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";

export class ItemTypeRepository implements IItem_Type {
	async getAll() {
		try {
			const item_types = await prisma.item_Type.findMany();
			return item_types;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accesing DB item type");
		}
	}

	async getOne(idOrName: string) {
		try {
			const item_type = await prisma.item_Type.findFirst({
				where: {
					OR: [{ item_type_id: idOrName }, { name: idOrName }],
				},
			});
			return item_type;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accesing DB item type");
		}
	}

	async create(data: CreateItemType) {
		try {
			const new_item_type = await prisma.item_Type.create({
				data,
			});
			return new_item_type;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accesing DB item type");
		}
	}

	async update(id: string, data: UpdateItemType) {
		try {
			const updated_item_type = await prisma.item_Type.update({
				where: {
					item_type_id: id,
				},
				data,
			});
			return updated_item_type;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accesing DB item type");
		}
	}

	async delete(id: string) {
		try {
			await prisma.item_Type.delete({
				where: {
					item_type_id: id,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something wrong while accesing DB item type");
		}
	}
}
