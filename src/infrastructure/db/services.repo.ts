import type { CreateServices, UpdateServices } from "../entity/types";
import type { IService } from "../entity/interface";
import { DBError } from "../entity/errors";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class ServicesRepository implements IService {
  async getAll() {
    try {
      const services = await prisma.service.findMany();
      return services;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async getOne(idOrName: string) {
    try {
      const service = await prisma.service.findFirst({
        where: {
          OR: [
            { service_id: idOrName },
            { name: idOrName },
            { item_type_id: idOrName },
          ],
        },
      });
      return service;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async create(data: CreateServices) {
    try {
      const new_service = await prisma.service.create({ data });
      return new_service;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async update(id: string, data: UpdateServices) {
    try {
      const updated_service = await prisma.service.update({
        where: { service_id: id },
        data,
      });

      return updated_service;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async delete(id: string) {
    try {
      await prisma.service.delete({ where: { service_id: id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }
}
