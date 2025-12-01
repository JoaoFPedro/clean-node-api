import { DbAddAccount } from "../../../data/use-cases/add-account/db-add-account";
import { LogControllerDecorator } from "../../decorators/log";
import { BCrypterAdapter } from "../../../infra/criptography/bcrypt";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account-mongo-repository";
import { SignUpController } from "../../../presentation/controllers/signup/signup";
import { Controller } from "../../../presentation/protocols";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log";
import { makeSingUpValidation } from "./signup-validation";

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
