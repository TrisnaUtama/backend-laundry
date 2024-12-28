import type { ItemRepository } from "../../infrastructure/db/item.repo";
import type { CreateItem, UpdateItem } from "../../infrastructure/entity/types";
import { TYPES } from "../../infrastructure/entity/types";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ItemServices {
  private itemRepo: ItemRepository;

  constructor(@inject(TYPES.itemRepo) itemRepo: ItemRepository) {
    this.itemRepo = itemRepo;
  }

  async getAll() {
    try {
      const items = await this.itemRepo.getAll();
      if (items.length === 0) throw new Error("items is empty !");
      return items;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing services item");
    }
  }

  async getOne(id: string) {
    try {
      const item = await this.itemRepo.getOne(id);
      if (!item) throw new Error("item not found !");
      return item;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing services item");
    }
  }

  async create(data: CreateItem) {
    try {
      const new_item = await this.itemRepo.create(data);
      return new_item;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing services item");
    }
  }

  async update(id: string, data: UpdateItem) {
    try {
      const existing_item = await this.itemRepo.getOne(id);
      if (!existing_item) throw new Error("Item not Found !");

      const updated_data = await this.itemRepo.update(id, data);
      return updated_data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing services item");
    }
  }

  async delete(id: string) {
    try {
      await this.itemRepo.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something error while accesing services item");
    }
  }
}