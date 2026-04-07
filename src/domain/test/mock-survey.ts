import { AddSurveyParams } from "../use-cases/survey/add-survey";

export const mockAddSurveyOneAnswer = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
    {
      answer: "other_answer",
    },
  ],
  date: new Date(),
});
export const mockAddSurveyTwoAnswers = (): AddSurveyParams[] => [
  {
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
    question: "other_question",
    answers: [
      {
        image: "other_question_image",
        answer: "other_question_answer",
      },
    ],
    date: new Date(),
  },
];
