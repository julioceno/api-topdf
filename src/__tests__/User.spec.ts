import request from "supertest";
import { app } from "../app"

describe('User', () => {
  it("test one", async () => {
    const res = await request(app)
      .get("/register");

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("message")
  }) 
});

/* describe('Test my app server', () => {
  it("test one", async () => {
    const res = await request(app)
      .get("/");

      expect(res.body).toHaveProperty("message")
  }) 
}); */