import { MissingParamError } from "../../erros";
import { Validation } from "../../protocols/validation";

export class RequiredFields implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error | null | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
