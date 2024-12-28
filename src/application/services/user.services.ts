import { TYPES } from "../../infrastructure/entity/types";
import type {
	CreateEmployee,
	UpdateUser,
} from "../../infrastructure/entity/types";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Prisma } from "@prisma/client";
import type { UserRepository } from "../../infrastructure/db/user.repo";

@injectable()
export class UserServices {
	private userRepo: UserRepository;

	constructor(@inject(TYPES.userRepo) userRepo: UserRepository) {
		this.userRepo = userRepo;
	}

	async getOne(user_id: string) {
		try {
			const user = await this.userRepo.getOne(user_id);
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new Error(error.message);
			}
			throw new Error("error while accesing user service get one");
		}
	}

	async update(user_id: string, data: UpdateUser) {
		try {
			const updated_user = await this.userRepo.update(user_id, data);
			return updated_user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new Error(error.message);
			}
			throw new Error("error while accesing user service get one");
		}
	}
}
