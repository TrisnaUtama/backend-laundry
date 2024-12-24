import type {  User } from "@prisma/client";
import type { UserRepository } from "../../infrastructure/db/user.repo";
import type { OTPRepository } from "../../infrastructure/db/otp.repo";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class AuthServices {
  private userRepo: UserRepository;
  private otpRepo: OTPRepository;

  constructor(
    @inject(TYPES.userRepo) userRepo: UserRepository,
    @inject(TYPES.otpRepo) otpRepo: OTPRepository
  ) {
    this.userRepo = userRepo;
    this.otpRepo = otpRepo;
  }

  async registerUser(
    data: Omit<User, "user_id" | "is_verified" | "created_at" | "updated_at">
  ) {
    const exsistingUser = await this.userRepo.getOne(data.email);

    if (exsistingUser) throw new Error("User Already Registered");

    const hashedPassword = await Bun.password.hash(data.password);
    const newData = {
      ...data,
      password: hashedPassword,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const createUser = await this.userRepo.create(newData);

    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const createOTP = {
      user_id: createUser.user_id,
      otp_code: randomCode.toString(),
      expiry_time: new Date(Date.now() + 3 * 60 * 1000),
      created_at: new Date(Date.now()),
    };

    await this.otpRepo.create(createOTP);

    return createUser;
  }
}
