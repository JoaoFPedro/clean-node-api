import { MongoHelper } from "../helpers/mongo-helpers";
import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "../../../../domain/models/load-survey-model";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-repository-by-id ";
import { ObjectId } from "mongodb";
import { SaveSurveyResultModel } from "@/domain/use-cases/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
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
  async loadById(id: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection("surveys");
    const surveyData = await surveysCollection?.findOne({
      _id: new ObjectId(id),
    });
    return MongoHelper.map(surveyData);
  }
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection("surveyResults");
    const updatedCollection = await surveyCollection?.updateOne(
      { surveyId: data.surveyId, accountId: data.accountId },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true },
    );

    return MongoHelper.map(updatedCollection);
  }
}
