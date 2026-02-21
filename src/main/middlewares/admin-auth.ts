import { adaptMiddleware } from "../adapters/express-middlawere-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";

export const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
