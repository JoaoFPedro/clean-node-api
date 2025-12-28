import { LogErrorRepository } from "../../../../data/protocols/db/log/log-error-repository";
import { MongoHelper } from "../helpers/mongo-helpers";
export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection("errors");
    if (!errorCollection) return;

    await errorCollection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
