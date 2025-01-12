import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/auth.route";
import { addressRouter } from "./presentation/router/address.route";
import { userRouter } from "./presentation/router/user.route";
import { employeeRouter } from "./presentation/router/employee.route";
import { itemTypeRouter } from "./presentation/router/item_type.route";
import { serviceRouter } from "./presentation/router/services.route";
import { orderRouter } from "./presentation/router/order.router";
import { itemRouter } from "./presentation/router/item.route";
import { detailOrderRouter } from "./presentation/router/detail_order.route";
import { paymentRouter } from "./presentation/router/payment.route";
import { rattingRouter } from "./presentation/router/ratting.route";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";

const app = new Elysia();
app
  .use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .use(
    swagger({
      path: "/docs",
    })
  )
  .group("/api", (app) =>
    app
      .use(authRouter)
      .use(userRouter)
      .use(employeeRouter)
      .use(addressRouter)
      .use(itemTypeRouter)
      .use(itemRouter)
      .use(serviceRouter)
      .use(orderRouter)
      .use(detailOrderRouter)
      .use(paymentRouter)
      .use(rattingRouter)
  )

  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
