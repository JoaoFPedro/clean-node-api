import request from "supertest";
import { setupApp } from "../config/app";
import { Express } from "express";

describe("CORS Middleware", () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupApp();
  });

  it("Should enable cors", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });
    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*");
  });
});
