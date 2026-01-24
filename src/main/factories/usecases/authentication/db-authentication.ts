import { DbAuthentication } from "../../../../data/use-cases/authentication/db-authentication";
import { Authentication } from "../../../../domain/use-cases/authentication";
import { BCrypterAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt";
import { JwtAdapter } from "../../../../infra/criptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";
import { Controller } from "../../../../presentation/protocols";
import env from "../../../config/env";

export const makeDbAuthentication = (): Authentication => {
  const bcryptAdapter = new BCrypterAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
};
