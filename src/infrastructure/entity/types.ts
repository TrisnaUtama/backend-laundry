import type { Address, Item_Type, OTP, Service, User } from "@prisma/client";

export const TYPES = {
  // repository
  userRepo: Symbol.for("UserRepository"),
  otpRepo: Symbol.for("OTPRepository"),
  addressRepo: Symbol.for("AddressRepository"),
  employeeRepo: Symbol.for("EmployeeRepository"),
  itemTypeRepo: Symbol.for("ItemTypeRepository"),
  servicesRepo: Symbol.for("ServicesRepository"),
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
export type CreateItemType = Omit<
  Item_Type,
  "item_type_id" | "updated_at" | "created_at"
>;
export type CreateServices = Omit<
  Service,
  "service_id" | "updated_at" | "created_at"
>;

// updates
export type UpdateUser = Partial<User>;
export type UpdateAddress = Partial<Address>;
export type UpdateOTP = Partial<OTP>;
export type UpdateItemType = Partial<Item_Type>;
export type UpdateServices = Partial<Service>;
