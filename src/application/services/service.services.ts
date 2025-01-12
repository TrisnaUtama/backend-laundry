import type { ServicesRepository } from "../../infrastructure/db/services.repo";
import type {
  CreateServices,
  UpdateServices,
} from "../../infrastructure/entity/types";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../infrastructure/entity/types";
import type { ILogger } from "../../infrastructure/entity/interface";

@injectable()
export class ServiceServices {
  private servicesRepo: ServicesRepository;
  private logger: ILogger;

  constructor(
    @inject(TYPES.servicesRepo) servicesRepo: ServicesRepository,
    @inject(TYPES.logger) logger: ILogger
  ) {
    this.servicesRepo = servicesRepo;
    this.logger = logger;
  }

  async getAll() {
    try {
      const services = await this.servicesRepo.getAll();
      if (services.length === 0) {
        this.logger.error("services is empty !");
        throw new Error("services is empty !");
      }

      return services;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);

        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing services");
    }
  }

  async getOne(idOrName: string) {
    try {
      const service = await this.servicesRepo.getOne(idOrName);
      if (!service) {
        this.logger.error("service not found");
        throw new Error("service not found");
      }

      return service;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing services");
    }
  }

  async create(data: CreateServices) {
    try {
      const exsist_service = await this.servicesRepo.getOne(data.item_type_id);
      if (exsist_service?.name === data.name) {
        this.logger.error("services already exist !");
        throw new Error("services already exsist !");
      }

      const new_service = await this.servicesRepo.create(data);
      return new_service;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing services");
    }
  }

  async update(id: string, data: UpdateServices) {
    try {
      const exsist_service = await this.servicesRepo.getOne(id);
      if (!exsist_service) {
        this.logger.error("service not found !");
        throw new Error("service not found !");
      }

      const updated_service = await this.servicesRepo.update(id, data);
      return updated_service;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing services");
    }
  }

  async delete(id: string) {
    try {
      const data = {
        status: false,
      };
      await this.servicesRepo.update(id, data);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("error while accessing services");
    }
  }
}
