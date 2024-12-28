import type { IRatting } from "../entity/interface";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";
import type { CreateRating } from "../entity/types";

export class RattingRepository implements IRatting {
  async getAll() {
    try {
      const rattings = await prisma.ratting.findMany();
      return rattings;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB ratting");
    }
  }

  async getOne(id: string) {
    try {
      const ratting = await prisma.ratting.findUnique({
        where: { ratting_id: id },
      });
      return ratting;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB ratting");
    }
  }

  async create(data: CreateRating) {
    try {
      const create_ratting = await prisma.ratting.create({ data });
      return create_ratting;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB ratting");
    }
  }

  async delete(id: string) {
    try {
      await prisma.ratting.delete({ where: { ratting_id: id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("error while accesing DB ratting");
    }
  }
}
