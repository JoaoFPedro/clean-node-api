import { InvalidParamError, MissingParamError } from "../../erros";
import { Validation } from "../../protocols/validation";

export class CompareFields implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}
  validate(input: any): Error | null | undefined {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
