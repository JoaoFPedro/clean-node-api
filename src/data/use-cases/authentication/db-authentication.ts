import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/use-cases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { Encrypter } from "../../protocols/criptography/encrypter";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";

export class DbAuthentication implements Authentication {
  private readonly hashComparer: HashComparer;
  private readonly encrypter: Encrypter;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
  private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;

  constructor(
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryStub;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }
  async auth(authenticantion: AuthenticationModel): Promise<string | null> {
    const loadAccount = await this.loadAccountByEmailRepositoryStub.loadByEmail(
      authenticantion.email
    );
    if (loadAccount) {
      const isValid = await this.hashComparer.compare(
        authenticantion.password,
        loadAccount.password
      );
      if (isValid) {
        const token = await this.encrypter.encrypt(loadAccount.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          loadAccount.id,
          token
        );
        return token;
      }
    }
    return null;
  }
}
