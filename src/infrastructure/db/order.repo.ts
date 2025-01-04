import type { ILogger, IOrder } from "../entity/interface";
import { TYPES, type CreateOrder, type UpdateOrder } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class OrderRepository implements IOrder {
  private logger: ILogger;

  constructor(@inject(TYPES.logger) logger: ILogger) {
    this.logger = logger;
  }
  async getAll() {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB order");
    }
  }

  async getAllByUserId(id: string) {
    try {
      const user_orders = await prisma.order.findMany({
        where: {
          user_id: id,
        },
      });
      return user_orders;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB order");
    }
  }

  async getOne(id: string) {
    try {
      const order = await prisma.order.findUnique({ where: { order_id: id } });
      return order;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB order");
    }
  }

  async create(data: CreateOrder) {
    try {
      const new_order = await prisma.order.create({ data });
      return new_order;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB order");
    }
  }

  async update(id: string, data: UpdateOrder) {
    try {
      const updated_order = await prisma.order.update({
        where: { order_id: id },
        data,
      });
      return updated_order;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB order");
    }
  }
}
