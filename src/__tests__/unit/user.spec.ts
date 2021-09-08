import request from "supertest"
import { getConnection, getRepository } from "typeorm";
import bcrypt from "bcryptjs";

import { User } from "../../app/models/User";
import createConnection from "../../database"

describe('User', () => {
  beforeAll( async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  });

  afterAll( async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close(); 
  });

  it ("Should encrypt user password", async () => {
    const repository = getRepository(User);

    const user = repository.create({ email: "julio3", password: "senha" }) 
    const userAlreadyExists = await repository.save(user);
    
    const isValidPassword = await bcrypt.compare("senha", userAlreadyExists.password);

    expect(isValidPassword).toBe(true);
  })
});
