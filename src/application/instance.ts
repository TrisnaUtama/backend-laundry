import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/types";
import { UserRepository } from "../infrastructure/db/user.repo";
import { OTPRepository } from "../infrastructure/db/otp.repo";
import { AuthServices } from "./services/auth.services";
import { AddressService as AddressServices } from "./services/address.services";
import { AddressRepository } from "../infrastructure/db/address.repo";
import { UserService as UserServices } from "./services/user.services";
import { EmployeeRepository } from "../infrastructure/db/employee.repo";
import { EmployeeServices } from "./services/employee.services";

const container = new Container();

// bind repositories to TYPES
container.bind<UserRepository>(TYPES.userRepo).to(UserRepository);
container.bind<OTPRepository>(TYPES.otpRepo).to(OTPRepository);
container.bind<AddressRepository>(TYPES.addressRepo).to(AddressRepository);
container.bind<EmployeeRepository>(TYPES.employeeRepo).to(EmployeeRepository);

// bind services
container.bind<AuthServices>(AuthServices).toSelf();
container.bind<AddressServices>(AddressServices).toSelf();
container.bind<UserServices>(UserServices).toSelf();
container.bind<EmployeeServices>(EmployeeServices).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const addressServices = container.get<AddressServices>(AddressServices);
export const userServices = container.get<UserServices>(UserServices);
export const employeeServices =
  container.get<EmployeeServices>(EmployeeServices);
