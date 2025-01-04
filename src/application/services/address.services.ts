import type { Address } from "@prisma/client";
import type { AddressRepository } from "../../infrastructure/db/address.repo";
import type { UpdateAddress } from "../../infrastructure/entity/types";
import type { ILogger } from "../../infrastructure/entity/interface";
import { TYPES } from "../../infrastructure/entity/types";
import "reflect-metadata";
import { injectable, inject } from "inversify";

@injectable()
export class AddressServices {
  private addressRepo: AddressRepository;
  private logger: ILogger;

  constructor(
    @inject(TYPES.addressRepo) addressRepo: AddressRepository,
    @inject(TYPES.logger) logger: ILogger
  ) {
    this.addressRepo = addressRepo;
    this.logger = logger;
  }

  async getAll(user_id: string) {
    try {
      const get_address = await this.addressRepo.getAll(user_id);

      if (!get_address) {
        this.logger.warn("invalid user id");
        throw new Error("invalid user id!");
      }

      return get_address;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("something went wrong while accessing address service");
    }
  }

  async getOne(idOrAddress: string) {
    try {
      const get_address = await this.addressRepo.getOne(idOrAddress);
      if (!get_address) {
        this.logger.error("error fetching data address");
        throw new Error("error fetchig data address");
      }

      return get_address;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("something went wrong while accessing address service");
    }
  }

  async create(
    data: Omit<
      Address,
      "user_address_id" | "created_at" | "updated_at" | "is_default"
    >
  ) {
    try {
      const exsist_address = await this.addressRepo.getOne(data.address);
      if (exsist_address) throw new Error("address already exsist");

      const new_address = {
        ...data,
        address: data.address,
        user_id: data.user_id,
      };

      const create_address = await this.addressRepo.create(new_address);
      if (!create_address) {
        this.logger.error("error while crating address");
        throw new Error("error while creating address");
      }

      return create_address;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("something went wrong while accessing address service");
    }
  }

  async update(id: string, data: UpdateAddress) {
    try {
      const updates_address = await this.addressRepo.update(id, data);

      if (!updates_address) {
        this.logger.error("error while updating user address !");
        throw new Error("error while updating user address !");
      }

      return updates_address;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("something went wrong while accessing address service");
    }
  }

  async delete(id: string) {
    try {
      await this.addressRepo.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw new Error(error.message);
      }
      this.logger.error(error as string);
      throw new Error("something went wrong while accessing address service");
    }
  }
}
