import type { IOTP } from "../entity/interface";
import { prisma } from "../utils/prisma";
import type { CreateOTP, UpdateOTP } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";

export class OTPRepository implements IOTP {
	async getAll() {
		try {
			const otp = await prisma.oTP.findMany();
			return otp;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing  OTP");
		}
	}

	async getOne(user_id: string) {
		try {
			const otp = await prisma.oTP.findFirst({
				where: {
					user_id: user_id,
				},
			});

			return otp;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB OTP");
		}
	}

	async create(data: CreateOTP) {
		try {
			const new_otp = await prisma.oTP.create({
				data,
			});

			return new_otp;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB otp create");
		}
	}

	async update(id: string, data: UpdateOTP) {
		try {
			const new_otp = await prisma.oTP.update({
				where: {
					otp_id: id,
				},
				data,
			});
			return new_otp;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError(error.message);
			}
			throw new DBError("something went wrong while accesing DB ");
		}
	}
}
