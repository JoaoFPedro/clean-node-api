import { SurveyModel } from "@/domain/models/load-survey-model";
import { AddSurveyParams } from "@/domain/use-cases/survey/add-survey";

export const mockFakeRequest = () => ({
  body: {
    email: "any_mail@gmail.com",
    name: "any_name",
    password: "any_password",
    confirmationPassword: "any_password",
  },
});
export const mockFakeAuthentication = (): any => ({
  email: "any_@mail.com",
  password: "any_password",
});

export const mockFakeAddSurvey = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});
export const mockFakeSurveyById = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],

    date: new Date(),
  };
};

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
