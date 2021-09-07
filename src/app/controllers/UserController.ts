import { Request, Response } from 'express';
import { getRepository } from "typeorm";

import { User } from "../models/User";

class UserController {
  async store(req: Request, res: Response) {
    const { email, password, confirm_password } = req.body;
    const repository = getRepository(User);
    
    try {
      console.log(1)
      const userAlreadyExists = await repository.findOne({ where: { email } })
      
      if (userAlreadyExists) {
        return res.status(409).json({ message: "User already exists" })
      };

      if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
      };
      console.log(2)

      const user = repository.create({ email, password });
      await repository.save(user);

      delete user.password;
      delete user.password_reset_expires;
      delete user.password_reset_token;
      console.log(3)

      return res.status(201).json(user);
    } catch(err) {
      return res.status(400).json({error: "Registration failed"});
    }
  };
};

export { UserController };