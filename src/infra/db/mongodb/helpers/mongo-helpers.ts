import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string | null,
  memoryServer: null as MongoMemoryServer | null,

  async connect(uri?: string): Promise<void> {
    // Se não for passada uma URI, inicia o Mongo em memória
    if (!uri) {
      this.memoryServer = await MongoMemoryServer.create();
      this.uri = this.memoryServer.getUri();
      console.log("🚀 MongoDB em memória iniciado:", this.uri);
    } else {
      this.uri = uri;
    }

    this.client = await MongoClient.connect(this.uri);
  },

  async disconnect(): Promise<void> {
    await this.client?.close();
    if (this.memoryServer) {
      await this.memoryServer.stop();
      console.log("🧹 MongoDB em memória parado");
    }
  },

  getCollection(name: string) {
    return this.client?.db()?.collection(name);
  },
  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
