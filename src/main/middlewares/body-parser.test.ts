import request from "supertest";
import { setupApp } from "../config/app";
import { Express } from "express";

describe("Body Parser Middleware", () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupApp();
  });

  it("Should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post("/test_body_parser")
      .send({ name: "Joao Pedro" })
      .expect({ name: "Joao Pedro" });
  });
});
