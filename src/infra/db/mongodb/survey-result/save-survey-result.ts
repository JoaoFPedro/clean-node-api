import { SaveSurveyResultRepository } from "@/data/protocols/db/save-survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/use-cases/surve-result/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helpers";
import { ObjectId } from "mongodb";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection("surveyResults");
    const res = await surveyResultCollection?.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
      },
      {
        $set: {
          surveyId: new ObjectId(data.surveyId),
          accountId: new ObjectId(data.accountId),
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
    return MongoHelper.map(res);
  }
}
