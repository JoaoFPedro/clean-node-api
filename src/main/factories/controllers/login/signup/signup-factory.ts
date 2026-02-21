import { SignUpController } from "@/presentation/controllers/login/signup/signup-controller";
import { Controller } from "@/presentation/protocols";
import { makeSingUpValidation } from "./signup-validation";
import { makeDbAuthentication } from "../../../usecases/authentication/db-authentication";
import { makeDbAddAccount } from "../../../usecases/account/add-account/db-add-account";
import { makeLogControllerDecorator } from "../../../decoratos/log-controller-decotaror-factory";

export const makeSingUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSingUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(controller);
};
