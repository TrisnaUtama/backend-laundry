import type { DetailOrderRepository } from "../../infrastructure/db/detail_order.repo";
import type {
  CreatePayment,
  UpdateDetailOrder,
} from "../../infrastructure/entity/types";
import type { ServicesRepository } from "../../infrastructure/db/services.repo";
import type { PaymentRepository } from "../../infrastructure/db/payment.repo";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../infrastructure/entity/types";
import { Decimal } from "@prisma/client/runtime/library";

@injectable()
export class DetailOrderServices {
  private detailOrderRepo: DetailOrderRepository;
  private servicesRepo: ServicesRepository;
  private paymentRepo: PaymentRepository;

  constructor(
    @inject(TYPES.detailOrderRepo) detailOrderRepo: DetailOrderRepository,
    @inject(TYPES.servicesRepo) servicesRepo: ServicesRepository,
    @inject(TYPES.paymentRepo) paymentRepo: PaymentRepository
  ) {
    this.detailOrderRepo = detailOrderRepo;
    this.servicesRepo = servicesRepo;
    this.paymentRepo = paymentRepo;
  }

  async getAll() {
    try {
      const detail_orders = await this.detailOrderRepo.getAll();

      if (detail_orders.length === 0)
        throw new Error("detail order is empty !");
      return detail_orders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing detail order services");
    }
  }

  async getOne(id: string) {
    try {
      const detail_order = await this.detailOrderRepo.getOne(id);
      if (!detail_order) throw new Error("detail order not found !");
      return detail_order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing detail order services");
    }
  }

  async update(id: string, data: UpdateDetailOrder) {
    try {
      const get_detail = await this.detailOrderRepo.getOne(id);
      if (!get_detail) {
        throw new Error("detail order not found !.");
      }
      const service = await this.servicesRepo.getOne(get_detail.service_id);

      if (!service) {
        throw new Error("Invalid service or service price.");
      }

      if (!data.weight || !(data.weight instanceof Decimal)) {
        throw new Error("Price is required and must be a Decimal.");
      }

      const calculate_price = data.weight.mul(new Decimal(service.price));
      const updated_detail_order_data: UpdateDetailOrder = {
        ...data,
        price: new Decimal(calculate_price.toFixed(0)),
      };
      const updated_detail_order = await this.detailOrderRepo.update(
        id,
        updated_detail_order_data
      );

      if (!updated_detail_order)
        throw new Error("something wrong while updateding detail order");

      if (!updated_detail_order.price)
        throw new Error("Updated detail order price is null or undefined.");

      const payment_data: CreatePayment = {
        order_id: updated_detail_order.order_id,
        total_price: updated_detail_order.price,
      };
      await this.paymentRepo.create(payment_data);
      return updated_detail_order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing detail order services");
    }
  }
}
