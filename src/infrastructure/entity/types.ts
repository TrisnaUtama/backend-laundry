import type { OTP, User } from "@prisma/client";

export const TYPES = {
  userRepo: Symbol.for("UserRepository"),
  otpRepo: Symbol.for("OTPRepository"),
  authServices: Symbol.for("AuthServices"),
};

export type CreateUser = Omit<User, "user_id">;
export type CreateOTP = Omit<OTP, "otp_id">;

export type UpdateUser = Partial<User>;
