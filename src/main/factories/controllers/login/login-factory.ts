import { LogMongoRepository } from "../../../../infra/db/mongodb/log/log-mongo-repository";
import { LoginController } from "../../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../../presentation/protocols/controller";
import { LogControllerDecorator } from "../../../decorators/log-controller-decorator";
import { makeLoginValidation } from "./login-validation";

import { makeDbAuthentication } from "../../usecases/authentication/db-authentication";
import { makeLogControllerDecorator } from "../../decoratos/log-controller-decotaror-factory";

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeLoginValidation(),
    makeDbAuthentication(),
  );

  return makeLogControllerDecorator(controller);
};
