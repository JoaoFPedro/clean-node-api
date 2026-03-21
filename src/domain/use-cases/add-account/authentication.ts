export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface Authentication {
  auth(authenticantion: AuthenticationParams): Promise<string | null>;
}
