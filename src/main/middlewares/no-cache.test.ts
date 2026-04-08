import request from "supertest";
import { setupApp } from "../config/app";
import { Express } from "express";
import { noCache } from "./no-cache";

describe("noCache Middleware", () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupApp();
  });

  it("Should disabled cache", async () => {
    app.get("/test_nocache", noCache, (req, res) => {
      res.send();
    });
    await request(app)
      .get("/test_nocache")
      .expect(
        "cache-control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      )
      .expect("pragma", "no-cache")
      .expect("expires", "0")
      .expect("surrogate-control", "no-store");
  });
});
