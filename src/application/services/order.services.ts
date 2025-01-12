import type { OrderRepository } from "../../infrastructure/db/order.repo";
import type { DetailOrderRepository } from "../../infrastructure/db/detail_order.repo";
import type {
	CreateDetailOrder,
	CreateItem,
	CreateOrder,
	CreatePayment,
	UpdateOrder,
	UpdatePayment,
} from "../../infrastructure/entity/types";
import type { ILogger } from "../../infrastructure/entity/interface";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../infrastructure/entity/types";
import { Decimal } from "@prisma/client/runtime/library";
import type { ItemRepository } from "../../infrastructure/db/item.repo";
import type { ServicesRepository } from "../../infrastructure/db/services.repo";
import type { PaymentRepository } from "../../infrastructure/db/payment.repo";

@injectable()
export class OrderServices {
	private orderRepo: OrderRepository;
	private itemRepo: ItemRepository;
	private serviceRepo: ServicesRepository;
	private paymentRepo: PaymentRepository;
	private detailOrderRepo: DetailOrderRepository;
	private logger: ILogger;

	constructor(
		@inject(TYPES.orderRepo) orderRepo: OrderRepository,
		@inject(TYPES.itemRepo) itemRepo: ItemRepository,
		@inject(TYPES.servicesRepo) serviceRepo: ServicesRepository,
		@inject(TYPES.paymentRepo) paymentRepo: PaymentRepository,
		@inject(TYPES.detailOrderRepo) detailOrderRepo: DetailOrderRepository,
		@inject(TYPES.logger) logger: ILogger,
	) {
		this.orderRepo = orderRepo;
		this.itemRepo = itemRepo;
		this.serviceRepo = serviceRepo;
		this.paymentRepo = paymentRepo;
		this.detailOrderRepo = detailOrderRepo;
		this.logger = logger;
	}

	async getAll() {
		try {
			const orders = await this.orderRepo.getAll();
			if (orders.length === 0) {
				this.logger.error("orders is empty");
				throw new Error("orders is empty");
			}

			return orders;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("something error while accesing order services");
		}
	}

	async getAllByUserId(id: string) {
		try {
			const user_orders = await this.orderRepo.getAllByUserId(id);
			if (!user_orders) {
				this.logger.error("orders is not found !");
				throw new Error("orders is not found !");
			}

			return user_orders;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("something error while accesing order services");
		}
	}

	async getOne(id: string) {
		try {
			const order = await this.orderRepo.getOne(id);
			if (!order) {
				this.logger.error("order not found !");
				throw new Error("order not found !");
			}

			return order;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("something error while accesing order services");
		}
	}

	async userCreateOrder(data: CreateOrder, detail: Decimal, item: CreateItem) {
		try {
			const item_data: CreateItem = {
				item_type_id: item.item_type_id,
				name: item.name,
			};
			const new_item = await this.itemRepo.create(item_data);

			const order_data: CreateOrder = {
				address_id: data.address_id,
				item_id: new_item.item_id,
				pickup_date: data.pickup_date,
				service_id: data.service_id,
				special_notes: data.special_notes,
				user_id: data.user_id,
			};
			const new_order = await this.orderRepo.create(order_data);

			const detail_order: CreateDetailOrder = {
				order_id: new_order.order_id,
				item_id: new_order.item_id,
				service_id: new_order.service_id,
				weight: detail,
			};

			const service_price = await this.serviceRepo.getOne(new_order.service_id);
			if (!service_price) {
				this.logger.error("something went wrong while process your request");
				throw new Error("something went wrong while process your request");
			}

			const servicePriceValue = Number(service_price.price);
			if (Number.isNaN(servicePriceValue)) {
				console.log(servicePriceValue);
				this.logger.error("Invalid service price value");
				throw new Error("Invalid service price value");
			}

			const weight = detail_order.weight ? Number(detail_order.weight) : 0;
			if (Number.isNaN(weight)) {
				this.logger.error("Invalid weight value");
				throw new Error("Invalid weight value");
			}

			const updated_order = {
				price: new Decimal((weight * servicePriceValue).toFixed(2)),
			};

			const DetailOrder = await this.detailOrderRepo.create(detail_order);

			const updatedDetailOrder = await this.detailOrderRepo.update(
				DetailOrder.detail_order_id,
				updated_order,
			);

			if (!updatedDetailOrder.price) {
				this.logger.error("something wrhong with detail order");
				throw new Error("something wrhong with detail order");
			}

			const payment_data: CreatePayment = {
				order_id: new_order.order_id,
				total_price: updatedDetailOrder.price,
			};

			await this.paymentRepo.create(payment_data);

			return new_order;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("something error while accesing order services");
		}
	}

	async update(id: string, data: UpdateOrder) {
		try {
			const updated_order = await this.orderRepo.update(id, data);
			if (!updated_order) {
				this.logger.error("something wrong while updated the order data");
				throw new Error("something wrong while updated the order data");
			}

			const status = updated_order.status;
			if (status === "process_done") {
				const data_payment: UpdatePayment = {
					payment_status: "waiting_for_payment",
				};
				await this.paymentRepo.update(updated_order.order_id, data_payment);
			}

			return updated_order;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("something error while accesing order services");
		}
	}
}
