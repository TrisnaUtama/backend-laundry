import { inject, injectable } from "inversify";
import type { EmployeeRepository } from "../../infrastructure/db/employee.repo";
import { TYPES } from "../../infrastructure/entity/types";
import type {
  CreateEmployee,
  UpdateUser,
} from "../../infrastructure/entity/types";
import { Prisma } from "@prisma/client";

@injectable()
export class EmployeeServices {
  private employeeRepo: EmployeeRepository;

  constructor(@inject(TYPES.employeeRepo) employeeRepo: EmployeeRepository) {
    this.employeeRepo = employeeRepo;
  }

  async getAll() {
    try {
      const employees = await this.employeeRepo.getAll();
      return employees;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error("error while accesing employee services");
    }
  }

  async getOne(id: string) {
    try {
      const employee = await this.employeeRepo.getOne(id);
      return employee;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error("error while accesing employee services");
    }
  }

  async registerEmployee(data: CreateEmployee) {
    try {
      const exsist_employee = await this.employeeRepo.getOne(data.email);
      if (exsist_employee) throw new Error("Employee data already registered");

      const hashed_password = await Bun.password.hash(data.password, "bcrypt");
      const data_employee = {
        ...data,
        password: hashed_password,
      };

      const new_employee = await this.employeeRepo.create(data_employee);
      return new_employee;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something went wrong while accessing register service");
    }
  }

  async update(id: string, data: UpdateUser) {
    try {
      const updated_employee = await this.employeeRepo.update(id, data);
      return updated_employee;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error("error while accesing employee services");
    }
  }

  async delete(id: string) {
    try {
      await this.employeeRepo.delete(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error("error while accesing employee services");
    }
  }
}
