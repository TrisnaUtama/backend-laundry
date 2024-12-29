import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import type { UpdateOrder } from "../../infrastructure/entity/types";
import { authServices, orderServices } from "../../application/instance";
import { JWT_NAME } from "../../infrastructure/constant/constant";
import { verifyJwt } from "../../infrastructure/utils/jwtSign";
import { Order_Status } from "@prisma/client";

export const orderRouter = new Elysia({ prefix: "/v1/orders" })
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
      const orders = await orderServices.getAll();
      if (!orders) {
        set.status = 400;
        throw new Error("server cannot process your request !");
      }
      set.status = 200;
      return orders;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing order routes");
    }
  })
  .get("/user/:id", async ({ set, params }) => {
    try {
      const orders = await orderServices.getAllByUserId(params.id);
      if (!orders) {
        set.status = 400;
        throw new Error("server cannot process your request !");
      }
      set.status = 200;
      return orders;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing order routes");
    }
  })
  .get("/:id", async ({ set, params }) => {
    try {
      const order = await orderServices.getOne(params.id);
      if (!order) {
        set.status = 400;
        throw new Error("server cannot process your request");
      }
      return order;
    } catch (error) {
      set.status = 500;
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("error while accessing order routes");
    }
  })
  .post(
    "/",
    async ({ set, body }) => {
      try {
        const data_order = {
          ...body,
          special_notes: body.special_notes ?? null,
        };
        const new_order = await orderServices.userCreateOrder(data_order);
        if (!new_order) {
          set.status = 400;
          throw new Error("server cannot process your request");
        }

        set.status = 201;
        return new_order;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("error while accessing order routes");
      }
    },
    {
      body: t.Object({
        user_id: t.String(),
        item_id: t.String(),
        service_id: t.String(),
        address_id: t.String(),
        pickup_date: t.Date(),
        delivery_date: t.Date(),
        special_notes: t.Optional(t.String()),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ params, set, body }) => {
      try {
        const updatedData: UpdateOrder = {
          user_id: body?.user_id,
          item_id: body?.item_id,
          service_id: body?.service_id,
          address_id: body?.address_id,
          pickup_date: body?.pickup_date,
          delivery_date: body?.delivery_date,
          cancellation_reason: body?.cancellation_reason,
          status: body?.status,
        };

        const updated_order = await orderServices.update(
          params.id,
          updatedData
        );

        set.status = 201;
        return updated_order;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("error while accessing order routes");
      }
    },
    {
      body: t.Optional(
        t.Object({
          user_id: t.Optional(t.String()),
          item_id: t.Optional(t.String()),
          service_id: t.Optional(t.String()),
          address_id: t.Optional(t.String()),
          pickup_date: t.Optional(t.Date()),
          delivery_date: t.Optional(t.Union([t.Date(), t.Null()])),
          cancellation_reason: t.Optional(t.String()),
          status: t.Optional(t.Enum(Order_Status)),
        })
      ),
    }
  );
