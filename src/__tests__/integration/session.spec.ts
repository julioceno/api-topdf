import request from "supertest"
import { getConnection } from "typeorm";
import { app } from "../../app"
import { tokenGenerate } from "../../app/functions/tokenGenerate"
import { getRepository } from "typeorm";

import { User } from "../../app/models/User";

import createConnection from "../../database"

describe('Session', () => {
  beforeAll( async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  });

  afterAll( async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close(); 
  });

  it ("Create user for router /register", async () => {
  

    const response = await request(app).post("/register").send({
      email: "julio@gmail.com",
      password: "senha", 
      confirm_password: "senha", 
    });

    expect(response.status).toBe(201)
  });

  it ("Creating user again /register", async () => {
    const response = await request(app).post("/register").send({
      email: "julio@gmail.com",
      password: "senha", 
      confirm_password: "senha", 
    });

    expect(response.status).toBe(409)
  });

  it ("Creating user again with different passwords", async () => {
    const response = await request(app).post("/register").send({
      email: "julio2@gmail.com",
      password: "senha", 
      confirm_password: "123", 
    });

    expect(response.status).toBe(400)
  });

  it ("Login user", async () => {
    const response = await request(app).post("/login").send({
      email: "julio@gmail.com",
      password: "senha", 
    });

    expect(response.status).toBe(200)
  }); 

  it ("Login credentials incorrect", async () => {
    const response = await request(app).post("/login").send({
      email: "julio@gmail.com",
      password: "123", 
    });

    expect(response.status).toBe(401)
  });

  it ("Should return JWT token when authenticated", async () => {
    const response = await request(app).post("/login").send({
      email: "julio@gmail.com",
      password: "senha", 
    });

    expect(response.body).toHaveProperty("token")
  });

  it ("Should be able to access private routes when authenticated", async () => {
    const repository = getRepository(User);
    const user = await repository.findOne({ where: { email: "julio@gmail.com" } })

    const response = await request(app)
      .get("/app")
      .set("Authorization", `Bearer ${tokenGenerate(user)}`)

      expect(response.status).toBe(200)
  });

  it ("Should not be able to access private routes when not authenticated", async () => {
    const response = await request(app)
      .get("/app");

      expect(response.status).toBe(401)
  });

  it ("Should not be able to access private routes jwt token invalid", async () => {
    const response = await request(app)
      .get("/app")
      .set("Authorization", `Bearer 123456`)

      expect(response.status).toBe(401)
  });

  it ("Não deve ser capaz de acessar rotas privadas quando o token não tiver duas partes", async () => {
    const response = await request(app)
      .get("/app")
      .set("Authorization", `Bearer `)

      expect(response.status).toBe(401)
  });

  it ("Should not able to access private routes when token malformed", async () => {
    const repository = getRepository(User);
    const user = await repository.findOne({ where: { email: "julio@gmail.com" } })

    const response = await request(app)
      .get("/app")
      .set("Authorization", `Be ${tokenGenerate(user)}`)

      expect(response.status).toBe(401)
  });
  
});
