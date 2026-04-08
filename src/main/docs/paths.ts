import { loginPath } from "./paths/login-path";
import { signupPath } from "./paths/signup-path";
import { surveyResultPath } from "./paths/survey-result-path";
import { surveyPath } from "./paths/surveys-path";

export const paths = {
  "/login": loginPath,
  "/surveys": surveyPath,
  "/signup": signupPath,
  "/surveys/{surveyId}/results": surveyResultPath,
};
