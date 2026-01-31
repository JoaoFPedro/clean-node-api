import { MongoHelper } from "../helpers/mongo-helpers";
import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const insertSurvey = await surveyCollection?.insertOne(surveyData);
    await surveyCollection?.findOne({
      _id: insertSurvey?.insertedId,
    });
  }
}
