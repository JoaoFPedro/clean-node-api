import { MissingParamError } from "../erros/missing-params-erros";
import { HttpRequest, HttpResponse } from "../protocols/https";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError("email"),
      };
    }
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError("name"),
      };
    }
    return {
      statusCode: 200,
      body: { message: "Sign up successful" },
    };
  }
}
