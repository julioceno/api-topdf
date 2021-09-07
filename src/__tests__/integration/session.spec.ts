import request from "supertest";
import { app } from "../../app";
import { getConnection } from "typeorm";
import { User } from "../../app/models/User";
import { getRepository } from "typeorm";

import createConnection from "../../database"

describe('First', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll( async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
    
  });

  it ("test", async () => {
    expect(2 + 2).toBe(4)
  })
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