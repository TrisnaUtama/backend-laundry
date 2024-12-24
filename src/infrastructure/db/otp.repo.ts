import type { IOTP } from "../entity/interface";
import { prisma } from "../utils/prisma";
import type { CreateOTP } from "../entity/types";
import { Prisma } from "@prisma/client";
import { DBError } from "../entity/errors";

export class OTPRepository implements IOTP {
  async getAll() {
    try {
      const otp = await prisma.oTP.findMany();
      return otp;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing  OTP");
    }
  }

  async getOne(id: string) {
    try {
      const otp = await prisma.oTP.findUnique({
        where: {
          otp_id: id,
        },
      });
      return otp;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB OTP");
    }
  }

  async create(data: CreateOTP) {
    try {
      const new_otp = await prisma.oTP.create({
        data,
      });
      return new_otp;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DBError(error.message);
      }
      throw new DBError("something went wrong while accesing DB otp");
    }
  }
}
