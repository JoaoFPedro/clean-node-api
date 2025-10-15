import bcrypt from "bcrypt";
import { BCrypter } from "./bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<String> {
    return new Promise((resolve) => resolve("hash"));
  },
}));
describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const sut = new BCrypter(12);
    const encryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(encryptSpy).toHaveBeenCalledWith("any_value", 12);
  });
  test("Should a hash on success case", async () => {
    const sut = new BCrypter(12);
    const encryptSpy = jest.spyOn(bcrypt, "hash");
    const hash = await sut.encrypt("any_value");
    console.log(hash);
    expect(hash).toBe("hash");
  });
});
