// IUser

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
import type { CreateOTP, CreateUser, UpdateUser } from "./types";


export interface IUser {
	getAll: () => Promise<User[]>;
	getOne: (id: string) => Promise<User | null>;
	create: (data: CreateUser) => Promise<User | null>;
	update: (id: string, data: UpdateUser ) => Promise<User>;
	delete: (id: string) => Promise<void>;
}

export interface IOTP {
    getAll: () => Promise<OTP[]>;
    getOne: (id: string) => Promise<OTP | null>;
    create: (data: CreateOTP) => Promise<OTP>;
}

export interface IEmployee {
	getAll: () => Promise<Employee[]>;
	getOne: (id: string) => Promise<Employee | null>;
	create: (data: Omit<Employee, "employee_id">) => Promise<Employee>;
	update: (id: string, data: UpdateUser) => Promise<Employee>;
	delete: (id: string) => Promise<void>;
}

export interface IAddress {
	getAll: () => Promise<Address | null>;
	getOne: (id: string) => Promise<Address | null>;
	create: (data: Omit<Address, "address_id">) => Promise<Address>;
	update: (id: string, data: Partial<Address>) => Promise<Address>;
	delete: (id: string) => Promise<void>;
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
