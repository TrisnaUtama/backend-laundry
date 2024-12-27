import type {
	Address,
	Employee,
	OTP,
	User,
	Ratting,
	Service,
	Item,
	Item_Type,
	Order,
	Payment,
} from "@prisma/client";
import type {
	CreateAddress,
	CreateEmployee,
	CreateOTP,
	CreateUser,
	UpdateAddress,
	UpdateOTP,
	UpdateUser,
} from "./types";

export interface IUser {
	getAll: () => Promise<User[]>;
	getOne: (id: string) => Promise<User | null>;
	create: (data: CreateUser) => Promise<User | null>;
	update: (id: string, data: UpdateUser) => Promise<User>;
	delete: (id: string) => Promise<void>;
}
export interface IEmployee {
	getAll: () => Promise<User[]>;
	getOne: (id: string) => Promise<User | null>;
	create: (data: CreateEmployee) => Promise<User | null>;
	update: (id: string, data: UpdateUser) => Promise<User>;
	delete: (id: string) => Promise<void>;
}

export interface IAddress {
	getAll: (id: string) => Promise<Address[]>;
	getOne: (id: string) => Promise<Address | null>;
	create: (data: CreateAddress) => Promise<Address>;
	update: (id: string, data: UpdateAddress) => Promise<Address>;
	delete: (id: string) => Promise<void>;
}

export interface IOTP {
	getAll: () => Promise<OTP[]>;
	getOne: (id: string, code: string) => Promise<OTP | null>;
	create: (data: CreateOTP) => Promise<OTP>;
	update: (id: string, data: Partial<UpdateOTP>) => Promise<OTP>;
}

export interface IRatting {
	getAll: () => Promise<Ratting | null>;
	getOne: (id: string) => Promise<Ratting | null>;
	create: (data: Omit<Ratting, "ratting_id">) => Promise<Ratting>;
	delete: (id: string) => Promise<void>;
}

export interface IService {
	getAll: () => Promise<Service | null>;
	getOne: (id: string) => Promise<Service | null>;
	create: (data: Omit<Service, "service_id">) => Promise<Service>;
	update: (id: string, data: Partial<Service>) => Promise<Service>;
	delete: (id: string) => Promise<void>;
}

export interface IItem {
	getAll: () => Promise<Item | null>;
	getOne: (id: string) => Promise<Item | null>;
	create: (data: Omit<Item, "item_id">) => Promise<Item>;
	update: (id: string, data: Partial<Item>) => Promise<Item>;
	delete: (id: string) => Promise<void>;
}

export interface IItem_Type {
	getAll: () => Promise<Item_Type | null>;
	getOne: (id: string) => Promise<Item_Type | null>;
	create: (data: Omit<Item_Type, "item_type_id">) => Promise<Item_Type>;
	update: (id: string, data: Partial<Item_Type>) => Promise<Item_Type>;
	delete: (id: string) => Promise<void>;
}

export interface IOrder {
	getAll: () => Promise<Order | null>;
	getOne: (id: string) => Promise<Order | null>;
	create: (data: Omit<Order, "order_id">) => Promise<Order>;
	update: (id: string, data: Partial<Order>) => Promise<Order>;
	delete: (id: string) => Promise<Order>;
}

export interface IPayment {
	getAll: () => Promise<Payment | null>;
	getOne: (id: string) => Promise<Payment | null>;
	create: (data: Omit<Payment, "payment_id">) => Promise<Payment>;
	update: (id: string, data: Partial<Payment>) => Promise<Payment>;
	delete: (id: string) => Promise<Payment>;
}

export interface IJwtPayload {
	user_id: string;
	role: string | null;
	iat?: number;
	exp?: number;
}
