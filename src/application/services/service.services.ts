import type { ServicesRepository } from "../../infrastructure/db/services.repo";
import type {
  CreateServices,
  UpdateServices,
} from "../../infrastructure/entity/types";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";

@injectable()
export class ServiceServices {
  private servicesRepo: ServicesRepository;

  constructor(@inject(TYPES.servicesRepo) servicesRepo: ServicesRepository) {
    this.servicesRepo = servicesRepo;
  }

  async getAll() {
    try {
      const services = await this.servicesRepo.getAll();
      if (services.length === 0) throw new Error("services is empty !");

      return services;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing services");
    }
  }

  async getOne(idOrName: string) {
    try {
      const service = await this.servicesRepo.getOne(idOrName);
      if (!service) throw new Error("service not found");

      return service;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing services");
    }
  }

  async create(data: CreateServices) {
    try {
      const exsist_service = await this.servicesRepo.getOne(data.item_type_id);
      if (exsist_service?.name === data.name)
        throw new Error("services already exsist !");

      const new_service = await this.servicesRepo.create(data);
      return new_service;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing services");
    }
  }

  async update(id: string, data: UpdateServices) {
    try {
      const exsist_service = await this.servicesRepo.getOne(id);
      if (!exsist_service) throw new Error("service not found !");

      const updated_service = await this.servicesRepo.update(id, data);
      return updated_service;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing services");
    }
  }

  async delete(id: string) {
    try {
      await this.servicesRepo.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing services");
    }
  }
}
