import request from "supertest";
import { app } from "../app"

describe('User', () => {
  it("Create account", async () => {
    const res = await request(app)
      .post("/register")
      .send({ 
        email: "julio2@gmail.com", 
        password: "123", 
        confirm_password: "123" 
      });

      expect(res.body).toHaveProperty("message")
  }) 
});
