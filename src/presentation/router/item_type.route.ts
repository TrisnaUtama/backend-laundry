import jwt from "@elysiajs/jwt";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import { Elysia, t } from "elysia";
import { authServices, itemTypeServices } from "../../application/instance";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";

export const itemTypeRouter = new Elysia({ prefix: "/v1/item_types" })
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

    if (jwtPayload.role === "Staff") {
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
      const item_types = await itemTypeServices.getAll();

      if (!item_types) {
        set.status = 400;
        throw new Error("server cannot process your request");
      }

      set.status = 200;
      return item_types;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing item type routes");
    }
  })
  .get("/:id", async ({ params, set }) => {
    try {
      const item_type = await itemTypeServices.getOne(params.id);
      if (!item_type) {
        set.status = 400;
        throw new Error("server cannot process your request !");
      }

      set.status = 200;
      return item_type;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing item type routes");
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const new_item_type = await itemTypeServices.create(body);
        if (!new_item_type) {
          set.status = 400;
          throw new Error("server cannot process your request !");
        }

        set.status = 201;
        return new_item_type;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong while accesing item type routes");
      }
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ set, params, body }) => {
      try {
        const updated_item_type = await itemTypeServices.update(
          params.id,
          body
        );
        if (!updated_item_type) {
          set.status = 400;
          throw new Error("server cannot process your request");
        }

        set.status = 201;
        return updated_item_type;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong while accesing item type routes");
      }
    },
    {
      body: t.Partial(
        t.Object({
          name: t.String(),
          status: t.Boolean(),
        })
      ),
    }
  )
  .delete("/:id", async ({ set, params }) => {
    try {
      await itemTypeServices.delete(params.id);
      set.status = 204;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("something wrong while accesing item type routes");
    }
  });
