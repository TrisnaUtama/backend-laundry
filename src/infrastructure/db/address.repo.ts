import type { IAddress } from "../entity/interface";
import { prisma } from "../utils/prisma";
import type { CreateAddress, UpdateAddress } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";

export class AddressRepository implements IAddress {
	async getAll(user_id: string) {
		try {
			const addresses = await prisma.address.findMany({
				where: {
					user_id,
				},
			});

			return addresses;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB address");
		}
	}

	async getOne(idOrAddress: string) {
		try {
			const address = await prisma.address.findFirst({
				where: {
					OR: [{ user_address_id: idOrAddress }, { user_id: idOrAddress }],
				},
			});
			return address;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
		}
		throw new DBError("something went wrong while accesing DB address");
	}

	async create(data: CreateAddress) {
		try {
			const new_address = await prisma.address.create({
				data,
			});

			return new_address;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
		}
		throw new DBError("something went wrong while accesing DB address");
	}

	async update(id: string, data: UpdateAddress) {
		try {
			const updated_address = await prisma.address.update({
				where: {
					user_address_id: id,
				},
				data,
			});

			if (!updated_address) throw new DBError(updated_address);

			return updated_address;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
		}
		throw new DBError("something went wrong while accesing DB address");
	}

	async delete(id: string) {
		try {
			await prisma.address.delete({
				where: {
					user_address_id: id,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
		}
		throw new DBError("something went wrong while accesing DB address");
	}
}
