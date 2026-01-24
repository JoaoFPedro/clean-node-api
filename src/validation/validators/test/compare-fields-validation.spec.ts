import {
  InvalidParamError,
  MissingParamError,
} from "../../../presentation/erros";
import { CompareFields } from "..";

const makeSut = (): CompareFields => {
  return new CompareFields("field", "fieldToCompare");
};
describe("Compare fields Validation", () => {
  test("Should return  InvalidParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "wrong_value",
    });

    expect(error).toEqual(new InvalidParamError("field"));
  });

  test("Should return  MissingParamError if validation fails", () => {
    const sut = makeSut();
    const validate = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });

    expect(validate).toBeFalsy();
  });
});
