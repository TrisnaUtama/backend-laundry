import type { DetailOrderRepository } from "../../infrastructure/db/detail_order.repo";
import type {
	CreatePayment,
	UpdateDetailOrder,
} from "../../infrastructure/entity/types";
import type { ServicesRepository } from "../../infrastructure/db/services.repo";
import type { PaymentRepository } from "../../infrastructure/db/payment.repo";
import type { ILogger } from "../../infrastructure/entity/interface";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../infrastructure/entity/types";
import { Decimal } from "@prisma/client/runtime/library";

@injectable()
export class DetailOrderServices {
	private detailOrderRepo: DetailOrderRepository;
	private servicesRepo: ServicesRepository;
	private paymentRepo: PaymentRepository;
	private logger: ILogger;

	constructor(
		@inject(TYPES.detailOrderRepo) detailOrderRepo: DetailOrderRepository,
		@inject(TYPES.servicesRepo) servicesRepo: ServicesRepository,
		@inject(TYPES.paymentRepo) paymentRepo: PaymentRepository,
		@inject(TYPES.logger) logger: ILogger,
	) {
		this.detailOrderRepo = detailOrderRepo;
		this.servicesRepo = servicesRepo;
		this.paymentRepo = paymentRepo;
		this.logger = logger;
	}

	async getAll() {
		try {
			const detail_orders = await this.detailOrderRepo.getAll();

			if (detail_orders.length === 0) {
				this.logger.error("detail order is empty !");
				throw new Error("detail order is empty !");
			}
			return detail_orders;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing detail order services");
		}
	}

	async getOne(id: string) {
		try {
			const detail_order = await this.detailOrderRepo.getOne(id);
			if (!detail_order) {
				this.logger.error("detail order not found !");
				throw new Error("detail order not found !");
			}
			return detail_order;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing detail order services");
		}
	}

	async update(id: string, data: UpdateDetailOrder) {
		try {
			const get_detail = await this.detailOrderRepo.getOne(id);
			if (!get_detail) {
				this.logger.error("detail order not found !");
				throw new Error("detail order not found !");
			}
			const service = await this.servicesRepo.getOne(get_detail.service_id);

			if (!service) {
				this.logger.error("Invalid service or service price");
				throw new Error("Invalid service or service price");
			}

			if (!data.weight || !(data.weight instanceof Decimal)) {
				this.logger.error("Price is required and must be a Decimal");
				throw new Error("Price is required and must be a Decimal");
			}

			const calculate_price = data.weight.mul(new Decimal(service.price));
			const updated_detail_order_data: UpdateDetailOrder = {
				...data,
				price: new Decimal(calculate_price.toFixed(0)),
			};
			const updated_detail_order = await this.detailOrderRepo.update(
				id,
				updated_detail_order_data,
			);

			if (!updated_detail_order) {
				this.logger.error("something wrong while updateding detail order");
				throw new Error("something wrong while updateding detail order");
			}

			if (!updated_detail_order.price) {
				this.logger.error("Updated detail order price is null or undefined");
				throw new Error("Updated detail order price is null or undefined");
			}

			const payment_data: CreatePayment = {
				order_id: updated_detail_order.order_id,
				total_price: updated_detail_order.price,
			};
			await this.paymentRepo.create(payment_data);
			return updated_detail_order;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing detail order services");
		}
	}
}
