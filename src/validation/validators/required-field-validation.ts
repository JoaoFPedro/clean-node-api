import { MissingParamError } from "../../presentation/erros";
import { Validation } from "../../presentation/protocols/validation";

export class RequiredFields implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error | null | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
