import { MissingParamError } from "../erros/missing-params-erros";
import { HttpRequest, HttpResponse } from "../protocols/https";
import { badRequest } from "../helpers/http-helper";
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("name"));
    }
    return {
      statusCode: 200,
      body: { message: "Sign up successful" },
    };
  }
}
