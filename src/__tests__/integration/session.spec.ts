import request from "supertest"
import { getConnection, getCustomRepository } from "typeorm";
import { app } from "../../app"

import { tokenGenerate } from "../../app/functions/tokenGenerate"
import { UserRepository } from "../../app/repositories/UserRepository";
import createConnection from "../../database"

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

  it ("Login user not found", async () => {
    const response = await request(app).post("/login").send({
      email: "julio2@gmail.com",
      password: "senha", 
    });

    expect(response.status).toBe(401)
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
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julio@gmail.com" } })

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

  it ("Should not be able to access private calls when token is not two-part", async () => {
    const response = await request(app)
      .get("/app")
      .set("Authorization", `Bearer `)

      expect(response.status).toBe(401)
  });

  it ("Should not able to access private routes when token malformed", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julio@gmail.com" } })

    const response = await request(app)
      .get("/app")
      .set("Authorization", `Be ${tokenGenerate(user)}`)

      expect(response.status).toBe(401)
  });

  it ("Should able for to recover forgot password", async () => {
    const response = await request(app)
      .post("/forgot_password")
      .send({
        email: "julio@gmail.com"
      });

      expect(response.status).toBe(200);
  });

  it ("Should not able for to recover forgot password", async () => {
    const response = await request(app)
      .post("/forgot_password")
      .send({
        email: "julio2@gmail.com"
      });

      expect(response.status).toBe(401);
  });

  it ("Should be able for to update email", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julio@gmail.com" } })
    
    const response = await request(app)
    .put("/update_user")
    .send({
      email: "julionovo@gmail.com",
      password_confirmation: "senha"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`)
    
    expect(response.status).toBe(200)
  });

  it ("Should be able for to update password", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julionovo@gmail.com" } })

    const response = await request(app)
    .put("/update_user")
    .send({
      password: "novasenha",
      password_confirmation: "senha"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`)
    
    expect(response.status).toBe(200)
  })

  it ("Should not be able for to update, user invalid", async () => {
    const response = await request(app)
    .put("/update_user")
    .send({
      password: "novasenha",
      password_confirmation: "senha"
    })
    .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiJ9.Y2JmMTJlNjYtYjY3YS00OGIwLWJjZDgtMTQ5MDYwNjAzMGMx.k6wwNzWsM41T3KpG94n5iOOQN5dJeYXSLiCFcDRzgzU`);

    expect(response.status).toBe(409)
  });

  it ("Should not be able for to update, new email or password undefined", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julionovo@gmail.com" } })

    const response = await request(app)
    .put("/update_user")
    .send({
      password_confirmation: "senha"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`)
    
    expect(response.status).toBe(400)
  });
  
  it ("Should not be able for to update, password confirmation undefined", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julionovo@gmail.com" } })

    const response = await request(app)
    .put("/update_user")
    .send({
      email: "email@gmail.com",
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`);

    expect(response.status).toBe(400)
  });


  it ("Should not be able for to update, password confirmation invalid", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julionovo@gmail.com" } })

    const response = await request(app)
    .put("/update_user")
    .send({
      email: "email@gmail.com",
      password_confirmation: "123"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`);

    expect(response.status).toBe(400);
  });

  it ("Login user new credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "julionovo@gmail.com",
      password: "novasenha", 
    });

    expect(response.status).toBe(200);
  }); 

  it ("Login user, old email", async () => {
    const response = await request(app).post("/login").send({
      email: "julio@gmail.com",
      password: "senha", 
    });

    expect(response.status).toBe(401);
  }); 

  it ("Login user, old password", async () => {
    const response = await request(app).post("/login").send({
      email: "julionovo@gmail.com",
      password: "senha", 
    });

    expect(response.status).toBe(401);
  }); 

  it ("Should be able delete user", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julionovo@gmail.com" } })

    const response = await request(app)
    .delete("/delete_user")
    .send({
      password_confirmation: "novasenha"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`);

    expect(response.status).toBe(200);
  });

  it ("Should be able to create a new user for testing the /delete_user route", async () => {
    const response = await request(app).post("/register").send({
      email: "julio2@gmail.com",
      password: "senha", 
      confirm_password: "senha", 
    });

    expect(response.status).toBe(201)
  });

  it ("Should not be able delete user, password confirmation undefined", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julio2@gmail.com" } })

    const response = await request(app)
    .delete("/delete_user")
    .send({
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`);

    expect(response.status).toBe(400);
  });

  it ("Should not be able delete user, password confirmation invalid", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julio2@gmail.com" } })

    const response = await request(app)
    .delete("/delete_user")
    .send({
      password_confirmation: "123"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`);

    expect(response.status).toBe(400);
  });

  it ("Should be able delete user", async () => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ where: { email: "julio2@gmail.com" } })

    const response = await request(app)
    .delete("/delete_user")
    .send({
      password_confirmation: "senha"
    })
    .set("Authorization", `Bearer ${tokenGenerate(user)}`);

    expect(response.status).toBe(200);
  });

});
