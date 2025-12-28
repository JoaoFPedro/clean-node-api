import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { AddAccount } from "../../../domain/use-cases/add-account-use-case";
import { Validation } from "../../protocols/validation";
import {
  badRequest,
  serverError,
  success,
} from "../../helpers/http/http-helper";
export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
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

      return success(addAccount);
    } catch (error) {
      return serverError(error as any);
    }
  }
}
