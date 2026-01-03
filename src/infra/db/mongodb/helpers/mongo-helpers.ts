import { MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string | null,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(this.uri);
  },

  async disconnect(): Promise<void> {
    await this.client?.close();
    this.client = null;
  },

  async getCollection(name: string) {
    if (!this.client) {
      await this.connect(this.uri || "");
    }
    return this.client?.db()?.collection(name);
  },
  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
