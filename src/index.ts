import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/auth.router";
import { addressRouter } from "./presentation/router/address.route";
import { userRouter } from "./presentation/router/user.route";
import { employeeRouter } from "./presentation/router/employee.route";

const app = new Elysia({ prefix: "/api" })
	.use(authRouter)
	.use(userRouter)
	.use(employeeRouter)
	.use(addressRouter)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
