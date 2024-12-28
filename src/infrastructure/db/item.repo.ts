import type { CreateItem, UpdateItem } from "../entity/types";
import type { IItem } from "../entity/interface";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";

export class ItemRepository implements IItem {
  async getAll() {
    try {
      const items = await prisma.item.findMany();
      return items;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something error while accesing DB item");
    }
  }

  async getOne(id: string) {
    try {
      const item = await prisma.item.findUnique({ where: { item_id: id } });
      return item;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something error while accesing DB item");
    }
  }

  async create(data: CreateItem) {
    try {
      const new_item = await prisma.item.create({ data });
      return new_item;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something error while accesing DB item");
    }
  }

  async update(id: string, data: UpdateItem) {
    try {
      const updated_item = await prisma.item.update({
        where: { item_id: id },
        data,
      });
      return updated_item;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something error while accesing DB item");
    }
  }

  async delete(id: string) {
    try {
      await prisma.item.delete({ where: { item_id: id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something error while accesing DB item");
    }
  }
}
