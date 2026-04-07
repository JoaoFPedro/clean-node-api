import { EmailValidator, Validation } from "@/presentation/protocols";

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
export const mockValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null | undefined {
      return null;
    }
  }

  return new ValidationStub();
};
