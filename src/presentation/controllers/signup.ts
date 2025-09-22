import { MissingParamError } from "../erros/missing-params-erros";
import { HttpRequest, HttpResponse } from "../protocols/https";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
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
    return {
      statusCode: 200,
      body: { message: "Sign up successful" },
    };
  }
}
