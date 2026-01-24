import { DbAddAccount } from "../../../../data/use-cases/add-account/db-add-account";
import { BCrypterAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12;
  const bCrypter = new BCrypterAdapter(salt);
  const accountRepo = new AccountMongoRepository();
  return new DbAddAccount(bCrypter, accountRepo, accountRepo);
};
