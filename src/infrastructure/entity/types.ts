import type {
	Address,
	Detail_Order,
	Item,
	Item_Type,
	Order,
	OTP,
	Payment,
	Ratting,
	Service,
	User,
} from "@prisma/client";

export const TYPES = {
	// repository
	userRepo: Symbol.for("UserRepository"),
	otpRepo: Symbol.for("OTPRepository"),
	addressRepo: Symbol.for("AddressRepository"),
	employeeRepo: Symbol.for("EmployeeRepository"),
	itemTypeRepo: Symbol.for("ItemTypeRepository"),
	servicesRepo: Symbol.for("ServicesRepository"),
	itemRepo: Symbol.for("ItemRepository"),
	orderRepo: Symbol.for("OrderRepository"),
	detailOrderRepo: Symbol.for("DetailOrderRepository"),
	paymentRepo: Symbol.for("PaymentRepository"),
	rattingRepo: Symbol.for("RattingRepository"),
	logger: Symbol.for("Logger"),
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
	"item_type_id" | "updated_at" | "created_at" | "status"
>;
export type CreateServices = Omit<
	Service,
	"service_id" | "updated_at" | "created_at" | "status"
>;
export type CreateItem = Omit<Item, "item_id" | "updated_at" | "created_at">;
export type CreateOrder = Omit<
	Order,
	| "order_id"
	| "updated_at"
	| "created_at"
	| "delivery_date"
	| "cancellation_reason"
	| "status"
	| "delivery_address"
>;
export type CreateDetailOrder = Omit<
	Detail_Order,
	"detail_order_id" | "updated_at" | "created_at" | "price"
>;
export type CreatePayment = Omit<
	Payment,
	| "payment_id"
	| "updated_at"
	| "created_at"
	| "payment_method"
	| "payment_status"
>;
export type CreateRating = Omit<Ratting, "ratting_id" | "created_at">;

// updates
export type UpdateUser = Partial<User>;
export type UpdateAddress = Partial<Address>;
export type UpdateOTP = Partial<OTP>;
export type UpdateItemType = Partial<Item_Type>;
export type UpdateServices = Partial<Service>;
export type UpdateItem = Partial<Item>;
export type UpdateOrder = Partial<Order>;
export type UpdateDetailOrder = Partial<Detail_Order>;
export type UpdatePayment = Partial<Payment>;
