import { InvalidParamError, MissingParamError } from "../../presentation/erros";
import { EmailValidator } from "../protocols/email-validator";
import { Validation } from "../../presentation/protocols/validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string,
  ) {}
  validate(input: any): Error | null | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
