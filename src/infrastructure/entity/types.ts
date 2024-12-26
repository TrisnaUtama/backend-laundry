import type { OTP, User } from "@prisma/client";

export const TYPES = {
	userRepo: Symbol.for("UserRepository"),
	otpRepo: Symbol.for("OTPRepository"),
	authServices: Symbol.for("AuthServices"),
};

export type CreateUser = Omit<User, "user_id" | "created_at" | "updated_at" | "refresh_token" | "isOnline">;
export type CreateOTP = Omit<OTP, "otp_id" | "created_at">;

export type UpdateUser = Partial<User>;
export type UpdateOTP = Partial<OTP>;
