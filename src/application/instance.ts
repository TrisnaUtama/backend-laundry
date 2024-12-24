import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/types";
import { UserRepository } from "../infrastructure/db/user.repo";
import { OTPRepository } from "../infrastructure/db/otp.repo";
import { AuthServices } from "./services/auth.services";

const container = new Container();

// Bind repositories to TYPES
container.bind<UserRepository>(TYPES.userRepo).to(UserRepository);
container.bind<OTPRepository>(TYPES.otpRepo).to(OTPRepository);

// Bind AuthServices
container.bind<AuthServices>(AuthServices).toSelf();

// Resolve AuthServices instance
export const authServices = container.get<AuthServices>(AuthServices);
