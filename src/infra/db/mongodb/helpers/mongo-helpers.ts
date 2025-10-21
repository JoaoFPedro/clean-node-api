import { MongoClient, Collection } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as string | null,

  db: null as any,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
