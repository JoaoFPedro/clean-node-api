import { badRequest } from "./components/bad-request";
import { forbidden } from "./components/forbidden";
import { notFound } from "./components/not-found";
import { serverError } from "./components/server-error";
import { unauthorized } from "./components/unauthorized";
import { paths } from "./paths";
import { schemas } from "./schemas";
import { apiKeyAuthSchema } from "./schemas/api-key-auth-schema";

export default {
  openapi: "3.0.0",
  info: {
    title: "Clean Node API",
    description: "API do curso do Mango",
    version: "1.0.0",
  },
  license: {
    name: "",
    url: "",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  tags: [
    {
      name: "Login",
    },
    {
      name: "Enquete",
    },
  ],
  paths: paths,
  schemas: schemas,
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    notFound,
    forbidden,
    badRequest,
    serverError,
    unauthorized,
  },
};
