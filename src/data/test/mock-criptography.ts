import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import { Hasher } from "@/data/protocols/criptography/hasher";
import { HashComparer } from "../protocols/criptography/hash-comparer";

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_value"));
    }
  }
  return new DecrypterStub();
};
export const mockEncrypter = (): Hasher => {
  class EncrypterStub implements Hasher {
    async hash(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  return new EncrypterStub();
};

export const mockTokenGenerator = (): Encrypter => {
  class Encrypter implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return "any_token";
    }
  }
  return new Encrypter();
};
export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};
