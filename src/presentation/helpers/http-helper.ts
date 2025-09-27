import { MissingParamError } from "../erros/missing-params-erros";
import { ServerError } from "../erros/server-erro";
import { HttpResponse } from "../protocols/https";

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};
export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};
