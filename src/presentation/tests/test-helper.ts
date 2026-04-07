import { SurveyModel } from "@/domain/models/load-survey-model";
import { HttpRequest } from "../protocols";
import { SurveyResultModel } from "@/domain/models/survey-result";

export const mockFakeRequest = () => ({
  body: {
    email: "any_mail@mail.com",
    password: "any_password",
  },
});
export const mockFakeAddSurveyRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
});

export const mockFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    },
    {
      id: "other_id",
      question: "other_id_question",
      answers: [
        {
          image: "other_id_image",
          answer: "other_id_answer",
        },
      ],
      date: new Date(),
    },
  ];
};
export const mockFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});
export const mockFakeSurveyResult = (): SurveyResultModel => ({
  surveyId: "any_id",
  answer: "any_answer",
  accountId: "any_account_id",
  date: new Date(),
  id: "any_id",
});
export const mockFakeIdRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_id",
  },
  body: {
    answer: "any_answer",
  },
  accountId: "any_account_id",
});
