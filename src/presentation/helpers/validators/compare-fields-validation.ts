import { InvalidParamError, MissingParamError } from "../../erros";
import { Validation } from "../../protocols/validation";

export class CompareFields implements Validation {
  private readonly fieldName: string;
  private readonly fieldToCompareName: string;

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName;
    this.fieldToCompareName = fieldToCompareName;
  }
  validate(input: any): Error | null | undefined {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
