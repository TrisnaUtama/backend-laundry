import { inject, injectable } from "inversify";
import "reflect-metadata";
import type { PaymentRepository } from "../../infrastructure/db/payment.repo";
import type {
  UpdateOrder,
  UpdatePayment,
} from "../../infrastructure/entity/types";
import type { ILogger } from "../../infrastructure/entity/interface";
import { TYPES } from "../../infrastructure/entity/types";
import type { OrderRepository } from "../../infrastructure/db/order.repo";

@injectable()
export class PaymentServices {
  private paymentRepo: PaymentRepository;
  private orderRepo: OrderRepository;
  private logger: ILogger;

  constructor(
    @inject(TYPES.paymentRepo) paymentRepo: PaymentRepository,
    @inject(TYPES.orderRepo) orderRepo: OrderRepository,
    @inject(TYPES.logger) logger: ILogger
  ) {
    this.paymentRepo = paymentRepo;
    this.orderRepo = orderRepo;
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

  async userPaid(id: string, data: UpdatePayment, order: UpdateOrder) {
    try {
      const data_payment: UpdatePayment = {
        ...data,
        payment_status: "paid",
      };

      const data_order: UpdateOrder = {
        delivery_address: order.delivery_address,
        status: "ready_for_delivery",
        delivery_date: order.delivery_date,
      };
      const updated_payment = await this.paymentRepo.update(id, data_payment);
      await this.orderRepo.update(updated_payment.order_id, data_order);
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
