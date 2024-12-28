import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/types";
import { UserRepository } from "../infrastructure/db/user.repo";
import { OTPRepository } from "../infrastructure/db/otp.repo";
import { AuthServices } from "./services/auth.services";
import { AddressServices } from "./services/address.services";
import { AddressRepository } from "../infrastructure/db/address.repo";
import { UserServices } from "./services/user.services";
import { EmployeeRepository } from "../infrastructure/db/employee.repo";
import { EmployeeServices } from "./services/employee.services";
import { ItemTypeRepository } from "../infrastructure/db/item_type.repo";
import { ItemTypeServices } from "./services/item_type.services";
import { ServicesRepository } from "../infrastructure/db/services.repo";
import { ServiceServices } from "./services/service.services";

const container = new Container();

// bind repositories
container.bind<UserRepository>(TYPES.userRepo).to(UserRepository);
container.bind<OTPRepository>(TYPES.otpRepo).to(OTPRepository);
container.bind<AddressRepository>(TYPES.addressRepo).to(AddressRepository);
container.bind<EmployeeRepository>(TYPES.employeeRepo).to(EmployeeRepository);
container.bind<ItemTypeRepository>(TYPES.itemTypeRepo).to(ItemTypeRepository);
container.bind<ServicesRepository>(TYPES.servicesRepo).to(ServicesRepository);

// bind services
container.bind<AuthServices>(AuthServices).toSelf();
container.bind<AddressServices>(AddressServices).toSelf();
container.bind<UserServices>(UserServices).toSelf();
container.bind<EmployeeServices>(EmployeeServices).toSelf();
container.bind<ItemTypeServices>(ItemTypeServices).toSelf();
container.bind<ServiceServices>(ServiceServices).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const addressServices = container.get<AddressServices>(AddressServices);
export const userServices = container.get<UserServices>(UserServices);
export const employeeServices =
	container.get<EmployeeServices>(EmployeeServices);
export const itemTypeServices =
	container.get<ItemTypeServices>(ItemTypeServices);
export const services = container.get<ServiceServices>(ServiceServices);
