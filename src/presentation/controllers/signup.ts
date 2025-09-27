import { badRequest, serverError } from "../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../erros";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";
export class SignUpController implements Controller {
  emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "confirmationPassword",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      return {
        statusCode: 200,
        body: { message: "Sign up successful" },
      };
    } catch (error) {
      return serverError();
    }
  }
}
