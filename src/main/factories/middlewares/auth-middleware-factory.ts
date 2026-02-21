import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { Middleware } from "@/presentation/protocols/middleware";
import { makeDbLoadAccountByToken } from "../usecases/load-account-by-token/load-account-by-token";

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role as string);
};
