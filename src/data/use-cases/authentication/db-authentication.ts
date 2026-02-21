import {
  Authentication,
  AuthenticationModel,
} from "@/domain/use-cases/authentication";
import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}
  async auth(authenticantion: AuthenticationModel): Promise<string | null> {
    const loadAccount = await this.loadAccountByEmailRepositoryStub.loadByEmail(
      authenticantion.email,
    );
    if (loadAccount) {
      const isValid = await this.hashComparer.compare(
        authenticantion.password,
        loadAccount.password,
      );
      if (isValid) {
        const token = await this.encrypter.encrypt(loadAccount.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          loadAccount.id,
          token,
        );
        return token;
      }
    }
    return null;
  }
}
