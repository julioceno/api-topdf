import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";

import { User } from "../models/User";
import { tokenGenerate } from "../functions/tokenGenerate";

class UserController {
  async store(req: Request, res: Response) {
    const { email, password, confirm_password } = req.body;
    const repository = getRepository(User);
    
    try {
      const userAlreadyExists = await repository.findOne({ where: { email } })

      if (userAlreadyExists) {
        return res.status(409).json({ message: "User already exists" })
      };

      if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
      };
      
      
      const user = repository.create({ email, password });
      await repository.save(user);

      const token = tokenGenerate(user)

      delete user.password;
      delete user.password_reset_expires;
      delete user.password_reset_token;

      return res.status(201).json({ user, token });
    } catch(err) {
      console.log(err)
      return res.status(400).json({error: "Registration failed"});
    }
  };

  async update(req: Request, res: Response) {
    const { email, password, password_confirmation } = req.body;
    const repository = getRepository(User);
    
    try { 
      const user = await repository.findOne({ where: { id: req.userId } });

      if (!user) {
        return res.status(409).json({ message: "User not exists" });
      };

      if (!email && !password) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      if (!password_confirmation) {
        return res.status(400).json({ error: "Invalid password confirmation" });
      };

      const isValidPassword = await bcrypt.compare(password_confirmation, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid password" });
      };

      if (email) {
        await repository.update( user.id, {
          email
        });
      };

      if (password) {
        user.password = password;
        await repository.save(user); 
      };


      return res.status(200).json({ user });
    } catch(err) {
      console.log(err)
      return res.status(400).json({error: "Updated failed"});
    };
  }

  async delete(req: Request, res: Response) {

  };
};

export { UserController };