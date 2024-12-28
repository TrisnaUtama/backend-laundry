import type {
  Address,
  OTP,
  User,
  Ratting,
  Service,
  Item,
  Item_Type,
  Order,
  Payment,
  Detail_Order,
} from "@prisma/client";
import type {
  CreateAddress,
  CreateDetailOrder,
  CreateEmployee,
  CreateItem,
  CreateItemType,
  CreateOrder,
  CreateOTP,
  CreatePayment,
  CreateRating,
  CreateServices,
  CreateUser,
  UpdateAddress,
  UpdateDetailOrder,
  UpdateItem,
  UpdateItemType,
  UpdateOrder,
  UpdateOTP,
  UpdatePayment,
  UpdateServices,
  UpdateUser,
} from "./types";

export interface IUser {
  getAll: () => Promise<User[]>;
  getOne: (id: string) => Promise<User | null>;
  create: (data: CreateUser) => Promise<User | null>;
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
  getAll: () => Promise<Ratting[]>;
  getOne: (id: string) => Promise<Ratting | null>;
  create: (data: CreateRating) => Promise<Ratting>;
  delete: (id: string) => Promise<void>;
}

export interface IService {
  getAll: () => Promise<Service[]>;
  getOne: (id: string) => Promise<Service | null>;
  create: (data: CreateServices) => Promise<Service>;
  update: (id: string, data: UpdateServices) => Promise<Service>;
  delete: (id: string) => Promise<void>;
}

export interface IItem {
  getAll: () => Promise<Item[]>;
  getOne: (id: string) => Promise<Item | null>;
  create: (data: CreateItem) => Promise<Item>;
  update: (id: string, data: UpdateItem) => Promise<Item>;
  delete: (id: string) => Promise<void>;
}

export interface IItem_Type {
  getAll: () => Promise<Item_Type[]>;
  getOne: (id: string) => Promise<Item_Type | null>;
  create: (data: CreateItemType) => Promise<Item_Type>;
  update: (id: string, data: UpdateItemType) => Promise<Item_Type>;
  delete: (id: string) => Promise<void>;
}

export interface IOrder {
  getAll: () => Promise<Order[]>;
  getAllByUserId: (id: string) => Promise<Order[]>;
  getOne: (id: string) => Promise<Order | null>;
  create: (data: CreateOrder) => Promise<Order>;
  update: (id: string, data: UpdateOrder) => Promise<Order>;
}
export interface IDetailOrder {
  getAll: () => Promise<Detail_Order[]>;
  getOne: (id: string) => Promise<Detail_Order | null>;
  create: (data: CreateDetailOrder) => Promise<Detail_Order>;
  update: (id: string, data: UpdateDetailOrder) => Promise<Detail_Order>;
  delete: (id: string) => Promise<void>;
}

export interface IPayment {
  getAll: () => Promise<Payment[]>;
  getOne: (id: string) => Promise<Payment | null>;
  create: (data: CreatePayment) => Promise<Payment>;
  update: (id: string, data: UpdatePayment) => Promise<Payment>;
  delete: (id: string) => Promise<void>;
}

export interface IJwtPayload {
  user_id: string;
  role: string | null;
  iat?: number;
  exp?: number;
}
