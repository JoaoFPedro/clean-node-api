export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  auth(authenticantion: AuthenticationModel): Promise<string | null>;
}
