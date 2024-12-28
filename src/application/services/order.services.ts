import type { OrderRepository } from "../../infrastructure/db/order.repo";
import type { DetailOrderRepository } from "../../infrastructure/db/detail_order.repo";
import type { ServicesRepository } from "../../infrastructure/db/services.repo";
import type {
  CreateDetailOrder,
  CreateOrder,
  UpdateOrder,
} from "../../infrastructure/entity/types";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class OrderServices {
  private orderRepo: OrderRepository;
  private detailOrderRepo: DetailOrderRepository;
  private servicesRepo: ServicesRepository;

  constructor(
    @inject(TYPES.orderRepo) orderRepo: OrderRepository,
    @inject(TYPES.servicesRepo) serviceRepo: ServicesRepository,
    @inject(TYPES.detailOrderRepo) detailOrderRepo: DetailOrderRepository
  ) {
    this.orderRepo = orderRepo;
    this.detailOrderRepo = detailOrderRepo;
    this.servicesRepo = serviceRepo;
  }

  async getAll() {
    try {
      const orders = await this.orderRepo.getAll();
      if (orders.length === 0) throw new Error("orders is empty");

      return orders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing order services");
    }
  }

  async getAllByUserId(id: string) {
    try {
      const user_orders = await this.orderRepo.getAllByUserId(id);
      if (!user_orders) throw new Error("orders is not found !");

      return user_orders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing order services");
    }
  }

  async getOne(id: string) {
    try {
      const order = await this.orderRepo.getOne(id);
      if (!order) throw new Error("order not found !");

      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing order services");
    }
  }

  async userCreateOrder(data: CreateOrder) {
    try {
      const new_order = await this.orderRepo.create(data);

      const detail_order: CreateDetailOrder = {
        order_id: new_order.order_id,
        item_id: new_order.item_id,
        service_id: new_order.service_id,
      };
      await this.detailOrderRepo.create(detail_order);

      return new_order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing order services");
    }
  }

  async update(id: string, data: UpdateOrder) {
    try {
      const updated_order = await this.orderRepo.update(id, data);

      return updated_order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing order services");
    }
  }
}
