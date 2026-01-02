import { DbAuthentication } from "../../../data/use-cases/authentication/db-authentication";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../presentation/protocols/controller";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeLoginValidation } from "./login-validation";
import { BCrypterAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BCrypterAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const logError = new LogMongoRepository();
  const loginController = new LoginController(
    makeLoginValidation(),
    dbAuthentication
  );

  return new LogControllerDecorator(loginController, logError);
};
