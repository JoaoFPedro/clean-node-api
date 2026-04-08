export const signupParamsSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    name: {
      type: "string",
    },
    confirmationPassword: {
      type: "string",
    },
  },
  required: ["email", "password", "name", "confirmationPassword"],
};
