import { DbAddAccount } from "../../../data/use-cases/add-account/db-add-account";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { BCrypterAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../../presentation/protocols";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { makeSingUpValidation } from "./signup-validation";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";

export const makeSingUpController = (): Controller => {
  const salt = 12;
  const bCrypter = new BCrypterAdapter(salt);
  const accountRepo = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bCrypter, accountRepo);
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSingUpValidation()
  );
  const logError = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logError);
};
