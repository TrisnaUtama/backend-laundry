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
import { ItemServices } from "./services/item.services";
import { OrderRepository } from "../infrastructure/db/order.repo";
import { DetailOrderRepository } from "../infrastructure/db/detail_order.repo";
import { OrderServices } from "./services/order.services";
import { ItemRepository } from "../infrastructure/db/item.repo";
import { DetailOrderServices } from "./services/detail_order.services";
import { PaymentRepository } from "../infrastructure/db/payment.repo";
import { PaymentServices } from "./services/payment.services";
import { RattingRepository } from "../infrastructure/db/ratting.repo";
import { RattingServices } from "./services/ratting.services";

const container = new Container();

// bind repositories
container.bind<UserRepository>(TYPES.userRepo).to(UserRepository);
container.bind<OTPRepository>(TYPES.otpRepo).to(OTPRepository);
container.bind<AddressRepository>(TYPES.addressRepo).to(AddressRepository);
container.bind<EmployeeRepository>(TYPES.employeeRepo).to(EmployeeRepository);
container.bind<ItemTypeRepository>(TYPES.itemTypeRepo).to(ItemTypeRepository);
container.bind<ServicesRepository>(TYPES.servicesRepo).to(ServicesRepository);
container.bind<ItemRepository>(TYPES.itemRepo).to(ItemRepository);
container.bind<OrderRepository>(TYPES.orderRepo).to(OrderRepository);
container
  .bind<DetailOrderRepository>(TYPES.detailOrderRepo)
  .to(DetailOrderRepository);
container.bind<PaymentRepository>(TYPES.paymentRepo).to(PaymentRepository);
container.bind<RattingRepository>(TYPES.rattingRepo).to(RattingRepository);

// bind services
container.bind<AuthServices>(AuthServices).toSelf();
container.bind<AddressServices>(AddressServices).toSelf();
container.bind<UserServices>(UserServices).toSelf();
container.bind<EmployeeServices>(EmployeeServices).toSelf();
container.bind<ItemTypeServices>(ItemTypeServices).toSelf();
container.bind<ServiceServices>(ServiceServices).toSelf();
container.bind<ItemServices>(ItemServices).toSelf();
container.bind<OrderServices>(OrderServices).toSelf();
container.bind<DetailOrderServices>(DetailOrderServices).toSelf();
container.bind<PaymentServices>(PaymentServices).toSelf();
container.bind<RattingServices>(RattingServices).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const addressServices = container.get<AddressServices>(AddressServices);
export const userServices = container.get<UserServices>(UserServices);
export const employeeServices =
  container.get<EmployeeServices>(EmployeeServices);
export const itemTypeServices =
  container.get<ItemTypeServices>(ItemTypeServices);
export const services = container.get<ServiceServices>(ServiceServices);
export const itemServices = container.get<ItemServices>(ItemServices);
export const orderServices = container.get<OrderServices>(OrderServices);
export const detailOrderServices =
  container.get<DetailOrderServices>(DetailOrderServices);
export const paymentServices = container.get<PaymentServices>(PaymentServices);
export const rattingServices = container.get<RattingServices>(RattingServices);
