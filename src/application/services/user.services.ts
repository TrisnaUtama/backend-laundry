import { TYPES } from "../../infrastructure/entity/types";
import type { UpdateUser } from "../../infrastructure/entity/types";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Prisma } from "@prisma/client";
import type { UserRepository } from "../../infrastructure/db/user.repo";
import type { ILogger } from "../../infrastructure/entity/interface";
import type { OTPRepository } from "../../infrastructure/db/otp.repo";

@injectable()
export class UserServices {
	private userRepo: UserRepository;
	private otpRepo: OTPRepository;
	private logger: ILogger;

	constructor(
		@inject(TYPES.userRepo) userRepo: UserRepository,
		@inject(TYPES.logger) logger: ILogger,
		@inject(TYPES.otpRepo) otpRepo: OTPRepository,
	) {
		this.userRepo = userRepo;
		this.otpRepo = otpRepo;
		this.logger = logger;
	}

	async getAll() {
		try {
			const users = await this.userRepo.getAll();
			return users;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accesing user service get one");
		}
	}

	async getOne(user_id: string) {
		try {
			const user = await this.userRepo.getOne(user_id);
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accesing user service ");
		}
	}

	async update(user_id: string, data: UpdateUser) {
		try {
			const updated_user = await this.userRepo.update(user_id, data);
			return updated_user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accesing user service ");
		}
	}

	async delete(id: string) {
		try {
			const data = {
				status: false,
			};
			await this.userRepo.update(id, data);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accesing user service ");
		}
	}
}
