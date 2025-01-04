import { inject, injectable } from "inversify";
import "reflect-metadata";
import type { PaymentRepository } from "../../infrastructure/db/payment.repo";
import type { UpdatePayment } from "../../infrastructure/entity/types";
import type { ILogger } from "../../infrastructure/entity/interface";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class PaymentServices {
  private paymentRepo: PaymentRepository;
  private logger: ILogger;

  constructor(
    @inject(TYPES.paymentRepo) paymentRepo: PaymentRepository,
    @inject(TYPES.logger) logger: ILogger
  ) {
    this.paymentRepo = paymentRepo;
    this.logger = logger;
  }

  async getAll() {
    try {
      const payments = await this.paymentRepo.getAll();
      return payments;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing payment services");
    }
  }

  async getOne(id: string) {
    try {
      const payment = await this.paymentRepo.getOne(id);
      if (!payment) {
        this.logger.error("payment not found !");
        throw new Error("payment not found !");
      }

      return payment;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing payment services");
    }
  }

  async update(id: string, data: UpdatePayment) {
    try {
      const updated_payment = await this.paymentRepo.update(id, data);
      return updated_payment;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing payment services");
    }
  }
}
