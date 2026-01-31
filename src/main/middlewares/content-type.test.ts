import request from "supertest";
import { setupApp } from "../config/app";
import { Express } from "express";

describe("Content-type Middleware", () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupApp();
  });

  it("Should return default content-type as json", async () => {
    app.get("/content-type", (req, res) => {
      res.send();
    });
    await request(app).get("/content-type").expect("content-type", /json/);
  });
  it("Should return  content-type as xml", async () => {
    app.get("/content-type_xml", (req, res) => {
      res.type("xml");
      res.send();
    });
    await request(app).get("/content-type_xml").expect("content-type", /xml/);
  });
});
