import { Elysia, t } from "elysia";
import type { IJwtPayload } from "../../infrastructure/entity/interface";
import {
  addressServices,
  authServices,
  userServices,
} from "../../application/instance";
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
} from "../../infrastructure/constant/constant";
import { AuthorizationError } from "../../infrastructure/entity/errors";
import { signJwt, verifyJwt } from "../../infrastructure/utils/jwtSign";

export const authRouter = new Elysia({ prefix: "/v1" })
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const user_data = {
          name: body.name,
          email: body.email,
          password: body.password,
          phone_number: body.phone_number,
        };

        const newUser = await authServices.registerUser(user_data);

        const address_data = {
          address: body.address,
          user_id: newUser.user_id,
        };
        await addressServices.create(address_data);

        set.status = 201;
        return newUser;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong when accessing route register");
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
        phone_number: t.String(),
        address: t.String(),
      }),
    }
  )
  .post(
    "verify",
    async ({ body, set }) => {
      try {
        const verify = await authServices.verifyAccoount(
          body.code,
          body.user_id
        );

        set.status = 405;
        if (!verify) throw new Error("Invalid OTP code !");

        set.status = 200;
        return "account is verified";
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong when accessing route register");
      }
    },
    {
      body: t.Object({
        code: t.String(),
        user_id: t.String(),
      }),
    }
  )
  .post(
    "/resend-otp",
    async ({ body, set }) => {
      try {
        const newOTP = await authServices.sendOtp(body.user_id, body.email);
        set.status = 204;
        return newOTP;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something wrong when accessing route register");
      }
    },
    {
      body: t.Object({
        email: t.String(),
        user_id: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set, cookie: { access_token, refresh_token } }) => {
      try {
        const login_user = await authServices.login(body.email, body.password);

        if (!login_user) {
          set.status = 401;
          throw new Error("error while login !");
        }

        access_token.set({
          value: login_user.accessToken,
          httpOnly: true,
          maxAge: ACCESS_TOKEN_EXP,
          path: "/",
        });

        refresh_token.set({
          value: login_user.refreshToken,
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXP,
          path: "/",
        });
        set.status = 200;

        return {
          message: "successfuly login !",
          data: {
            user: login_user.user,
            access_token: login_user.accessToken,
            refress_token: login_user.refreshToken,
          },
        };
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          console.log(error.message);
          throw new Error(error.message);
        }
        throw new Error("something wrong when accessing route register");
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/refresh",
    async ({ set, cookie: { access_token, refresh_token } }) => {
      try {
        if (!refresh_token.value) {
          set.status = 401;
          throw new AuthorizationError("Unauthorized");
        }

        const jwtPayload: IJwtPayload = verifyJwt(
          refresh_token.value.toString()
        );
        if (!jwtPayload) {
          set.status = 403;
          throw new AuthorizationError("Forbidden");
        }

        const user_id = jwtPayload.user_id;
        if (!user_id) throw new AuthorizationError("invalid payload !");

        const user = await userServices.getOne(user_id);
        if (!user) {
          set.status = 403;
          throw new AuthorizationError("Forbidden");
        }

        const payload = {
          user_id: user.user_id,
          role: user.role,
        };
        const accessToken = signJwt(payload, ACCESS_TOKEN_EXP);
        const refreshToken = signJwt(payload, REFRESH_TOKEN_EXP);

        access_token.set({
          value: accessToken,
          httpOnly: true,
          maxAge: ACCESS_TOKEN_EXP,
          path: "/",
        });

        refresh_token.set({
          value: refreshToken,
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXP,
          path: "/",
        });

        const refresh_data = {
          isOnline: true,
          refresh_token: refreshToken,
        };
        await userServices.update(user.user_id, refresh_data);
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          console.log(error.message);
          throw new Error(error.message);
        }
        throw new Error("something wrong when accessing route register");
      }
    }
  );
