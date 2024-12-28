import jwt from "@elysiajs/jwt";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import { Elysia, t } from "elysia";
import { authServices, rattingServices } from "../../application/instance";
import { JWT_NAME } from "../../constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";

export const rattingRouter = new Elysia({ prefix: "/v1/rattings" })
  .use(
    jwt({
      name: JWT_NAME,
      secret: `${process.env.JWT_SECRET}`,
    })
  )
  .derive(async ({ cookie: { access_token }, set }) => {
    if (!access_token.value) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    const jwtPayload: IJwtPayload = verifyJwt(access_token.value.toString());

    if (!jwtPayload) {
      set.status = 403;
      throw new Error("Forbidden");
    }

    const userId = jwtPayload.user_id;
    if (!userId) throw new Error("invalid payload !");
    const user = await authServices.decodeUser(userId.toString());
    if (!user) {
      set.status = 403;
      throw new Error("Forbidden");
    }

    return {
      user,
    };
  })
  .get("/", async ({ set }) => {
    try {
      const rattings = await rattingServices.getAll();

      if (!rattings) {
        set.status = 400;
        throw new Error("server cannot process your request");
      }

      set.status = 200;
      return rattings;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing rattings routes");
    }
  })
  .get("/:id", async ({ params, set }) => {
    try {
      const ratting = await rattingServices.getOne(params.id);
      if (!ratting) {
        set.status = 400;
        throw new Error("server cannot process your request !");
      }

      set.status = 200;
      return ratting;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing rattings routes");
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const new_ratting = await rattingServices.create(body);
        if (!new_ratting) {
          set.status = 400;
          throw new Error("server cannot process your request !");
        }

        set.status = 201;
        return new_ratting;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong while accesing rattings routes");
      }
    },
    {
      body: t.Object({
        user_id: t.String(),
        order_id: t.String(),
        ratting: t.Number(),
        comment: t.String(),
      }),
    }
  )
  .delete("/:id", async ({ set, params }) => {
    try {
      await rattingServices.delete(params.id);
      set.status = 204;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing rattings routes");
    }
  });
