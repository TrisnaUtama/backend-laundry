import { Elysia, t } from "elysia";
import { authServices } from "../../application/instance";
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
} from "../../infrastructure/constant/constant";

export const authRouter = new Elysia({ prefix: "/v1" })
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const newUser = await authServices.registerUser(body);
        set.status = 201;
        return newUser;
      } catch (error) {
        set.status = 500;
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("something went wrong in route register");
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
        phone_number: t.String(),
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
        throw new Error("something went wrong in route register");
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
        throw new Error("something went wrong in route register");
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
        if (error instanceof Error) {
          console.log(error.message);
          throw new Error(error.message);
        }
        throw new Error("something went wrong in route register");
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );