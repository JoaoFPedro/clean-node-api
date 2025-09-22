export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missim Param: ${paramName}`);
    this.name = "MissingParamError";
  }
}
