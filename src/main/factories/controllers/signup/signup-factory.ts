import { LogControllerDecorator } from "../../../decorators/log-controller-decorator";
import { SignUpController } from "../../../../presentation/controllers/login/signup/signup-controller";
import { Controller } from "../../../../presentation/protocols";
import { LogMongoRepository } from "../../../../infra/db/mongodb/log/log-mongo-repository";
import { makeSingUpValidation } from "./signup-validation";
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication";
import { makeDbAddAccount } from "../../usecases/add-account/db-add-account";
import { makeLogControllerDecorator } from "../../decoratos/log-controller-decotaror-factory";

export const makeSingUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSingUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(controller);
};
