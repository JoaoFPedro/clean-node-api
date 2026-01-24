import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { AddAccount } from "../../../domain/use-cases/add-account-use-case";
import { Validation } from "../../protocols/validation";
import {
  badRequest,
  forbidden,
  serverError,
  success,
  unauthorized,
} from "../../helpers/http/http-helper";
import { Authentication } from "../login/login-controller-protocols";
import { EmailInUseError } from "../../erros";
export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }

    try {
      const { name, password, email } = httpRequest.body;
      const addAccount = await this.addAccount.add({
        email,
        name,
        password,
      });
      if (!addAccount) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({ email, password });

      return success({ accessToken });
    } catch (error) {
      return serverError(error as any);
    }
  }
}
