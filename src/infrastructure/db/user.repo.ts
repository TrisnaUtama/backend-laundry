import { Prisma } from "@prisma/client";
import type { IUser } from "../entity/interface";
import type { CreateUser, UpdateUser } from "../entity/types";
import { prisma } from "../utils/prisma";
import { DBError } from "../entity/errors";

export class UserRepository implements IUser {
  async getAll() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async getOne(idOrEmail: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ user_id: idOrEmail }, { email: idOrEmail }],
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async create(data: CreateUser) {
    try {
      const user = await prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async update(id: string, data: UpdateUser) {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          user_id: id,
        },
        data: {
          email: data.email,
          name: data.name,
          phone_number: data.phone_number,
          created_at: new Date(),
        },
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }

  async delete(id: string) {
    try {
      await prisma.user.delete({
        where: {
          user_id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB Repo");
    }
  }
}