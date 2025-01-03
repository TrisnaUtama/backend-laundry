import { Role, type OTP, type User } from "@prisma/client";
import type { UserRepository } from "../../infrastructure/db/user.repo";
import type { OTPRepository } from "../../infrastructure/db/otp.repo";
import type { CreateUser, UpdateUser } from "../../infrastructure/entity/types";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import { notifyEmail } from "../../infrastructure/utils/email";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "../../constant/constant";
import { signJwt } from "../../infrastructure/utils/jwtSign";
import { password } from "bun";

@injectable()
export class AuthServices {
	private userRepo: UserRepository;
	private otpRepo: OTPRepository;

	constructor(
		@inject(TYPES.userRepo) userRepo: UserRepository,
		@inject(TYPES.otpRepo) otpRepo: OTPRepository,
	) {
		this.userRepo = userRepo;
		this.otpRepo = otpRepo;
	}

	async registerUser(data: CreateUser) {
		try {
			const exsisting_user = await this.userRepo.getOne(data.email);

			if (exsisting_user) throw new Error("User Already Registered");

			const hashed_password = await Bun.password.hash(data.password, "bcrypt");
			const newData = {
				...data,
				password: hashed_password,
				is_verified: false,
				role: Role.User,
			};

			const create_user = await this.userRepo.create(newData);
			await this.sendOtp(create_user.user_id, create_user.email);
			return create_user;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something went wrong while accessing register service");
		}
	}

	async verifyAccoount(code: string, user_id: string) {
		try {
			const otp = await this.otpRepo.getOne(user_id);
			const date_now_wib = new Date(Date.now() + 7 * 60 * 60 * 1000).getTime();

			if (!otp) throw new Error("invalid otp code");
			if (otp.otp_code !== code) throw new Error("invalid OTP !");
			if (date_now_wib > otp.expiry_time.getTime())
				throw new Error("expired OTP !");

			const updated_user_data: Partial<User> = {
				is_verified: true,
			};

			await this.userRepo.update(user_id, updated_user_data);

			return true;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something went wrong while accessing register service");
		}
	}

	async sendOtp(user_id: string, email: string) {
		try {
			const randomCode = Math.floor(100000 + Math.random() * 900000);
			const expiryTimeUTC = new Date(Date.now() + 3 * 60 * 1000);
			const expiryTimeWIB = new Date(
				expiryTimeUTC.getTime() + 7 * 60 * 60 * 1000,
			);
			const expiryTimePlus5Minutes = new Date(
				expiryTimeWIB.getTime() + 5 * 60 * 1000,
			);

			const otp = await this.otpRepo.getOne(user_id);

			const otpData: Omit<OTP, "otp_id" | "created_at"> = {
				user_id: user_id,
				otp_code: randomCode.toString(),
				expiry_time: expiryTimePlus5Minutes,
			};

			if (!otp) await this.otpRepo.create(otpData);
			if (otp) await this.otpRepo.update(otp.otp_id, otpData);

			await notifyEmail(randomCode, email);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something went wrong while accessing register service");
		}
	}

	async login(email: string, password: string) {
		try {
			const get_user = await this.userRepo.getOne(email);

			if (!get_user) throw new Error("Invalid Credentials");
			if (!get_user.is_verified) throw new Error("verified your account !");
			const compare_password = await Bun.password.verify(
				password,
				get_user.password,
				"bcrypt",
			);
			if (!compare_password) throw new Error("Invalid Credentials");

			const payload = {
				user_id: get_user.user_id,
				role: get_user.role,
			};

			const accessToken = signJwt(payload, ACCESS_TOKEN_EXP);
			const refreshToken = signJwt(payload, REFRESH_TOKEN_EXP);

			const updated_user = await this.userRepo.update(get_user.user_id, {
				refresh_token: refreshToken,
				isOnline: true,
			});

			const sanitizedUser = {
				user_id: updated_user.user_id,
				role: updated_user.role,
				name: updated_user.name,
				isOnline: updated_user.isOnline,
			};

			if (!updated_user) throw new Error("error while login in auth services");

			return {
				accessToken,
				refreshToken,
				user: sanitizedUser,
			};
		} catch (error) {
			if (error instanceof Error) {
				console.log("data");
				throw new Error(error.message);
			}
			throw new Error("something went wrong while accessing register service");
		}
	}

	async decodeUser(user_id: string) {
		try {
			const user = await this.userRepo.getOne(user_id);
			return user;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something went wrong while accessing register service");
		}
	}

	async logout(user_id: string, data: UpdateUser) {
		try {
			await this.userRepo.update(user_id, data);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("something went wrong while accessing register service");
		}
	}
}
