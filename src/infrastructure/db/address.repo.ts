import type { IAddress, ILogger } from "../entity/interface";
import { prisma } from "../utils/prisma";
import { TYPES, type CreateAddress, type UpdateAddress } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class AddressRepository implements IAddress {
  private logger: ILogger;

  constructor(@inject(TYPES.logger) logger: ILogger) {
    this.logger = logger;
  }
  async getAll(user_id: string) {
    try {
      const addresses = await prisma.address.findMany({
        where: {
          user_id,
        },
      });

      return addresses;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something went wrong while accesing DB address");
    }
  }

  async getOne(idOrAddress: string) {
    try {
      const address = await prisma.address.findFirst({
        where: {
          OR: [{ user_address_id: idOrAddress }, { user_id: idOrAddress }],
        },
      });
      return address;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something went wrong while accesing DB address");
    }
  }

  async create(data: CreateAddress) {
    try {
      const new_address = await prisma.address.create({
        data,
      });

      return new_address;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something went wrong while accesing DB address");
    }
  }

  async update(id: string, data: UpdateAddress) {
    try {
      const updated_address = await prisma.address.update({
        where: {
          user_address_id: id,
        },
        data,
      });

      if (!updated_address) throw new DBError(updated_address);

      return updated_address;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something went wrong while accesing DB address");
    }
  }

  async delete(id: string) {
    try {
      await prisma.address.delete({
        where: {
          user_address_id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("something went wrong while accesing DB address");
    }
  }
}
