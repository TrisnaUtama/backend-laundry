import type { IItem_Type, ILogger } from "../entity/interface";
import {
  TYPES,
  type CreateItemType,
  type UpdateItemType,
} from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class ItemTypeRepository implements IItem_Type {
  private logger: ILogger;

  constructor(@inject(TYPES.logger) logger: ILogger) {
    this.logger = logger;
  }
  async getAll() {
    try {
      const item_types = await prisma.item_Type.findMany({
        where: {
          status: true,
        },
      });
      return item_types;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something wrong while accesing DB item type");
    }
  }

  async getOne(idOrName: string) {
    try {
      const item_type = await prisma.item_Type.findFirst({
        where: {
          OR: [{ item_type_id: idOrName }, { name: idOrName }],
        },
      });
      return item_type;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something wrong while accesing DB item type");
    }
  }

  async create(data: CreateItemType) {
    try {
      const new_item_type = await prisma.item_Type.create({
        data,
      });
      return new_item_type;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something wrong while accesing DB item type");
    }
  }

  async update(id: string, data: UpdateItemType) {
    try {
      const updated_item_type = await prisma.item_Type.update({
        where: {
          item_type_id: id,
        },
        data,
      });
      return updated_item_type;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something wrong while accesing DB item type");
    }
  }

  async delete(id: string) {
    try {
      await prisma.item_Type.delete({
        where: {
          item_type_id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something wrong while accesing DB item type");
    }
  }
}
