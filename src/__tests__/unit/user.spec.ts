import request from "supertest"
import { getConnection, getCustomRepository } from "typeorm";

import bcrypt from "bcryptjs";

import { UserRepository } from "../../app/repositories/UserRepository";
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
    const userRepository = getCustomRepository(UserRepository);

    const user = userRepository.create({ email: "julio3", password: "senha" }) 
    const userAlreadyExists = await userRepository.save(user);
    
    const isValidPassword = await bcrypt.compare("senha", userAlreadyExists.password);

    expect(isValidPassword).toBe(true);
  })
});
