import jwt from "@elysiajs/jwt";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import { Elysia, t } from "elysia";
import { authServices, itemServices } from "../../application/instance";
import { JWT_NAME } from "../../constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";

export const itemRouter = new Elysia({ prefix: "/v1/items" })
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

    if (jwtPayload.role === "User" || jwtPayload.role === "Staff") {
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
      const items = await itemServices.getAll();

      if (!items) {
        set.status = 400;
        throw new Error("server cannot process your request");
      }

      set.status = 200;
      return items;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing item routes");
    }
  })
  .get("/:id", async ({ params, set }) => {
    try {
      const item = await itemServices.getOne(params.id);
      if (!item) {
        set.status = 400;
        throw new Error("server cannot process your request !");
      }

      set.status = 200;
      return item;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing item routes");
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const new_item = await itemServices.create(body);
        if (!new_item) {
          set.status = 400;
          throw new Error("server cannot process your request !");
        }

        set.status = 201;
        return new_item;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong while accesing item routes");
      }
    },
    {
      body: t.Object({
        item_type_id: t.String(),
        name: t.String(),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ set, params, body }) => {
      try {
        const updated_item = await itemServices.update(params.id, body);
        if (!updated_item) {
          set.status = 400;
          throw new Error("server cannot process your request");
        }

        set.status = 201;
        return updated_item;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong while accesing item routes");
      }
    },
    {
      body: t.Partial(
        t.Object({
          item_type_id: t.String(),
          name: t.String(),
        })
      ),
    }
  )
  .delete("/:id", async ({ set, params }) => {
    try {
      await itemServices.delete(params.id);
      set.status = 204;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing item routes");
    }
  });
