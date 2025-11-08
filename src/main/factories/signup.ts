import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { BCrypterAdapter } from "../../infra/criptography/bcrypt";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-mongo-repository";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSingUpController = (): SignUpController => {
  const salt = 12;
  const bCrypter = new BCrypterAdapter(salt);
  const accountRepo = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bCrypter, accountRepo);
  const emailValidator = new EmailValidatorAdapter();
  return new SignUpController(emailValidator, dbAddAccount);
};
