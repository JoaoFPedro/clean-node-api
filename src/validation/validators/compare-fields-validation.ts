import { InvalidParamError } from "../../presentation/erros";
import { Validation } from "../../presentation/protocols/validation";

export class CompareFields implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}
  validate(input: any): Error | null | undefined {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
