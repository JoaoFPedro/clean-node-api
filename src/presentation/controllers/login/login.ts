import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from "../../helpers/http/http-helper";

import { Validation } from "../../protocols/validation";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
} from "./login-protocols";

export class LoginController implements Controller {
  private readonly validation: Validation;
  private readonly authenticantion: Authentication;

  constructor(validation: Validation, authenticantion: Authentication) {
    this.validation = validation;
    this.authenticantion = authenticantion;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;

      const accessToken = await this.authenticantion.auth({ email, password });
      if (!accessToken) {
        return unauthorized();
      }
      return success({ accessToken });
    } catch (error) {
      return serverError(error as any);
    }
  }
}
