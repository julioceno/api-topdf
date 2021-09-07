import request from "supertest"
import { getConnection } from "typeorm";
import { app } from "../../app"

import createConnection from "../../database"

describe('User tests', () => {
  beforeAll( async () => {
    const connection = await createConnection()
    // await connection.runMigrations()
  });

  afterAll( async () => {
   /*  const connection = getConnection();
    await connection.dropDatabase();
    await connection.close(); */
  });

  it ("Create user", async () => {
    const response = await request(app).post('/register').send({
      email: "julio@gmail.com",
      password: "senha",
      confirm_password: "senha",
    });
 
    console.log(response)
    expect(response.status).toBe(201);
    expect(201).toBe(201);
  });
});

/* describe("## Authentication ##", () => {
  beforeAll( async () => {
    const connection = await createConnection()
    await connection.runMigrations().then((): any => {
      console.log("📜️ Successfully connected with database development")   
    });
  });

  afterAll( async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it ("Login", async () => {
    const sum = 2 + 2;

    expect(sum).toBe(4)
  });
}) */