import { accountSchema } from "./schemas/account-schema";
import { addSurveypParamsSchema } from "./schemas/add-survey-params-schema";
import { errorSchema } from "./schemas/error-schema";
import { loginParamsSchema } from "./schemas/login-params-schema";
import { saveSurveyParamsSchema } from "./schemas/save-survey-result-schema";
import { signupParamsSchema } from "./schemas/signup-params-schema";
import { surveyAnswerSchema } from "./schemas/survey-answer-schema";
import { surveyResultSchema } from "./schemas/survey-result-schema ";
import { surveySchema } from "./schemas/survey-schema";
import { surveysSchema } from "./schemas/surveys-schema";

export const schemas = {
  account: accountSchema,
  error: errorSchema,
  loginParams: loginParamsSchema,
  signupParams: signupParamsSchema,
  addSurveyParams: addSurveypParamsSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema,
};
