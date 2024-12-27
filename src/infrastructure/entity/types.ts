import type { Address, OTP, User } from "@prisma/client";

export const TYPES = {
  // repository
  userRepo: Symbol.for("UserRepository"),
  otpRepo: Symbol.for("OTPRepository"),
  addressRepo: Symbol.for("AddressRepository"),
  employeeRepo: Symbol.for("EmployeeRepository"),

  // services
  authServices: Symbol.for("AuthServices"),
};

// creates
export type CreateUser = Omit<
  User,
  | "user_id"
  | "created_at"
  | "updated_at"
  | "refresh_token"
  | "isOnline"
  | "is_verified"
  | "status"
  | "role"
>;

export type CreateEmployee = Omit<
  User,
  | "user_id"
  | "created_at"
  | "updated_at"
  | "refresh_token"
  | "isOnline"
  | "is_verified"
  | "status"
>;
export type CreateOTP = Omit<OTP, "otp_id" | "created_at">;
export type CreateAddress = Omit<
  Address,
  "user_address_id" | "updated_at" | "created_at" | "is_default"
>;

// updates
export type UpdateUser = Partial<User>;
export type UpdateAddress = Partial<Address>;
export type UpdateOTP = Partial<OTP>;
