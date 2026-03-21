import { AccountModel } from "@/domain/models/account";
import {
  Decrypter,
  LoadAccountByTokenRepository,
} from "./db-load-account-by-token-protocols";
import { LoadAccountByToken } from "@/domain/use-cases/add-account/load-account-by-token";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypt: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}
  async loadByToken(
    accesToken: string,
    role?: string,
  ): Promise<AccountModel | null> {
    const token = await this.decrypt.decrypt(accesToken);

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accesToken,
        role,
      );
      if (account) {
        return account;
      }
    }
    return null;
  }
}
