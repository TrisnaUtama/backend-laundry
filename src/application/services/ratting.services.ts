import { injectable, inject } from "inversify";
import "reflect-metadata";
import type { RattingRepository } from "../../infrastructure/db/ratting.repo";
import type { CreateRating } from "../../infrastructure/entity/types";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class RattingServices {
  private rattingRepo: RattingRepository;

  constructor(@inject(TYPES.rattingRepo) rattingRepo: RattingRepository) {
    this.rattingRepo = rattingRepo;
  }

  async getAll() {
    try {
      const rattings = await this.rattingRepo.getAll();
      if (rattings.length === 0) throw new Error("rattings is empty !");
      return rattings;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing ratting services");
    }
  }

  async getOne(id: string) {
    try {
      const ratting = await this.rattingRepo.getOne(id);
      if (!ratting) throw new Error("ratting not found !");
      return ratting;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing ratting services");
    }
  }

  async create(data: CreateRating) {
    try {
      const new_ratting = await this.rattingRepo.create(data);
      return new_ratting;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing ratting services");
    }
  }

  async delete(id: string) {
    try {
      await this.rattingRepo.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing ratting services");
    }
  }
}
