import { MissingParamError } from "../../erros";
import { Validation } from "../../protocols/validation";

export class RequiredFields implements Validation {
  private readonly fieldName: string;
  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }
  validate(input: any): Error | null | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
