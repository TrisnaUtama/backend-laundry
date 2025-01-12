import type { ILogger, IOTP } from "../entity/interface";
import { prisma } from "../utils/prisma";
import { TYPES, type CreateOTP, type UpdateOTP } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class OTPRepository implements IOTP {
	private logger: ILogger;

	constructor(@inject(TYPES.logger) logger: ILogger) {
		this.logger = logger;
	}
	async getAll() {
		try {
			const otp = await prisma.oTP.findMany();
			return otp;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB OTP");
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
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
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
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB OTP");
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
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB OTP");
		}
	}

	async delete(id: string) {
		try {
			await prisma.oTP.delete({
				where: {
					otp_id: id,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new DBError(error.message);
			}
			this.logger.error(error as string);
			throw new DBError("something went wrong while accesing DB OTP");
		}
	}
}
