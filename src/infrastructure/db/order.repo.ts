import type { IOrder } from "../entity/interface";
import type { CreateOrder, UpdateOrder } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";

export class OrderRepository implements IOrder {
  async getAll() {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
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
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB order");
    }
  }

  async getOne(id: string) {
    try {
      const order = await prisma.order.findUnique({ where: { order_id: id } });
      return order;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB order");
    }
  }

  async create(data: CreateOrder) {
    try {
      const new_order = await prisma.order.create({ data });
      return new_order;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
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
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB order");
    }
  }

  async delete(id: string) {
    try {
      await prisma.order.delete({ where: { order_id: id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB order");
    }
  }
}
