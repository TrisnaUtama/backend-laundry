import type { OrderRepository } from "../../infrastructure/db/order.repo";
import type { DetailOrderRepository } from "../../infrastructure/db/detail_order.repo";
import type {
  CreateOrder,
  UpdateOrder,
} from "../../infrastructure/entity/types";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class OrderServices {
  private orderRepo: OrderRepository;
  private detailOrderRepo: DetailOrderRepository;

  constructor(@inject(TYPES.orderRepo) orderRepo: OrderRepository @inject(TYPES.detailOrderRepo) detailOrderRepo : DetailOrderRepository) {
    this.orderRepo = orderRepo;
    this.detailOrderRepo = detailOrderRepo;
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

  async create(data: CreateOrder) {
    try {
      const new_order = await this.orderRepo.create(data);
        const insert_detail_order = await this.detailOrderRepo.create()

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

  async delete(id: string) {
    try {
      await this.orderRepo.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing order services");
    }
  }
}
