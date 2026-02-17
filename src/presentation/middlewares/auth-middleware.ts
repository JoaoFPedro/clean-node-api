import { LoadAccountByToken } from "../../domain/use-cases/load-account-by-token";
import { AccessDeniedError } from "../erros";
import { forbidden, serverError, success } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";

export class AuthMiddleware implements Middleware {
  private readonly loadAccountByToken: LoadAccountByToken;
  private readonly role: string;

  constructor(loadAccountByToken: LoadAccountByToken, role: string) {
    this.loadAccountByToken = loadAccountByToken;
    this.role = role;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(
          accessToken,
          this.role,
        );
        if (account) {
          return success({ accountId: account.id });
        }
      }
      const error = forbidden(new AccessDeniedError());
      return error;
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
