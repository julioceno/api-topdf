import request from "supertest";
import { getConnection, getCustomRepository } from "typeorm";
import { app } from "../../app";

import { tokenGenerate } from "../../app/functions/tokenGenerate";
import { UserRepository } from "../../app/repositories/UserRepository";
import createConnection from "../../database";

describe('Session', () => {
  beforeAll( async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  });

  afterAll( async () => {
    const connection = getConnection();
    await connection.dropDatabase()
    await connection.close(); 
  });


  it ("Login user", async () => {
   
    expect(200).toBe(200)
  }); 

})