import { MongoHelper } from "../helpers/mongo-helpers";
import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "../../../../domain/models/load-survey-model";

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const insertSurvey = await surveyCollection?.insertOne(surveyData);
    await surveyCollection?.findOne({
      _id: insertSurvey?.insertedId,
    });
  }
  async loadSurveys(): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection("surveys");
    const surveysData = await surveysCollection?.find().toArray();
    return surveysData ? surveysData.map(MongoHelper.map) : [];
  }
}
