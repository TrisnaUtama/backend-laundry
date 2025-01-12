import type {
	CreateItemType,
	UpdateItemType,
} from "../../infrastructure/entity/types";
import type { ItemTypeRepository } from "../../infrastructure/db/item_type.repo";
import type { ILogger } from "../../infrastructure/entity/interface";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class ItemTypeServices {
	private itemTypeRepo: ItemTypeRepository;
	private logger: ILogger;

	constructor(
		@inject(TYPES.itemTypeRepo) itemTypeRepo: ItemTypeRepository,
		@inject(TYPES.logger) logger: ILogger,
	) {
		this.itemTypeRepo = itemTypeRepo;
		this.logger = logger;
	}

	async getAll() {
		try {
			const item_types = await this.itemTypeRepo.getAll();
			return item_types;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing item type services");
		}
	}

	async getOne(idOrName: string) {
		try {
			const item_type = await this.itemTypeRepo.getOne(idOrName);
			return item_type;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing item type services");
		}
	}

	async create(data: CreateItemType) {
		try {
			const exsist_item_type = await this.itemTypeRepo.getOne(data.name);
			if (exsist_item_type) {
				this.logger.error("item type already created !");
				throw new Error("item type already created !");
			}

			const new_item_type = await this.itemTypeRepo.create(data);
			return new_item_type;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing item type services");
		}
	}

	async update(id: string, data: UpdateItemType) {
		try {
			const exsist_item_type = await this.itemTypeRepo.getOne(id);
			if (!exsist_item_type) {
				this.logger.error("item type not found !");
				throw new Error("item type not found !");
			}

			const updated_item_type = await this.itemTypeRepo.update(id, data);
			return updated_item_type;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing item type services");
		}
	}

	async delete(id: string) {
		try {
			const data = {
				status: false,
			};
			await this.itemTypeRepo.update(id, data);
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message);
				throw new Error(error.message);
			}
			this.logger.error(error as string);
			throw new Error("error while accessing item type services");
		}
	}
}
