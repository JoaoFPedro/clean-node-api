export const addSurveypParamsSchema = {
  type: "object",
  properties: {
    question: {
      type: "string",
    },
    answers: {
      type: "array",
      items: {
        $ref: "#/schemas/surveyAnswer",
      },
    },
  },
  required: ["email", "password"],
};
