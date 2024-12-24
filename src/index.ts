import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/auth.router";

const app = new Elysia({ prefix: "/api" }).use(authRouter).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
