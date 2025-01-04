import { TYPES, type CreatePayment, type UpdatePayment } from "../entity/types";
import type { ILogger, IPayment } from "../entity/interface";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";
import { prisma } from "../utils/prisma";
import "reflect-metadata";
import { inject, injectable } from "inversify";

@injectable()
export class PaymentRepository implements IPayment {
  private logger: ILogger;

  constructor(@inject(TYPES.logger) logger: ILogger) {
    this.logger = logger;
  }

  async getAll() {
    try {
      const payments = await prisma.payment.findMany();
      return payments;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB payment");
    }
  }

  async getOne(id: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { payment_id: id },
      });
      return payment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB payment");
    }
  }

  async create(data: CreatePayment) {
    try {
      const new_payment = await prisma.payment.create({ data });
      return new_payment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB payment");
    }
  }

  async update(id: string, data: UpdatePayment) {
    try {
      const updated_payment = await prisma.payment.update({
        where: { payment_id: id },
        data,
      });
      return updated_payment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB payment");
    }
  }

  async delete(id: string) {
    try {
      await prisma.payment.delete({ where: { payment_id: id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new DBError(error.message);
      }
      this.logger.error(error as string);
      throw new DBError("error while accesing DB payment");
    }
  }
}
