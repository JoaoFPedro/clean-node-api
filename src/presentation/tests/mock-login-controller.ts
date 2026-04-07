import {
  Authentication,
  AuthenticationParams,
} from "@/domain/use-cases/add-account/authentication";
import { Validation } from "@/presentation/protocols/validation";

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authenticantion: AuthenticationParams): Promise<string | null> {
      return "any_token";
    }
  }
  return new AuthenticationStub();
};
