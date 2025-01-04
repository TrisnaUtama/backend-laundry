import { injectable, inject } from "inversify";
import "reflect-metadata";
import type { RattingRepository } from "../../infrastructure/db/ratting.repo";
import type { ILogger } from "../../infrastructure/entity/interface";
import type { CreateRating } from "../../infrastructure/entity/types";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class RattingServices {
  private rattingRepo: RattingRepository;
  private logger: ILogger;

  constructor(
    @inject(TYPES.rattingRepo) rattingRepo: RattingRepository,
    @inject(TYPES.logger) logger: ILogger
  ) {
    this.rattingRepo = rattingRepo;
    this.logger = logger;
  }

  async getAll() {
    try {
      const rattings = await this.rattingRepo.getAll();
      if (rattings.length === 0) {
        this.logger.error("rattings is empty !");
        throw new Error("rattings is empty !");
      }
      return rattings;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing ratting services");
    }
  }

  async getOne(id: string) {
    try {
      const ratting = await this.rattingRepo.getOne(id);
      if (!ratting) {
        this.logger.error("ratting not found !");
        throw new Error("ratting not found !");
      }
      return ratting;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing ratting services");
    }
  }

  async create(data: CreateRating) {
    try {
      const new_ratting = await this.rattingRepo.create(data);
      return new_ratting;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing ratting services");
    }
  }

  async delete(id: string) {
    try {
      await this.rattingRepo.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing ratting services");
    }
  }
}
