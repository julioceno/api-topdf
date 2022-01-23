import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import bcrypt from "bcryptjs";

import { UserRepository } from '../repositories/UserRepository';
import { tokenGenerate } from "../functions/tokenGenerate";

class UserController {
  async store(req: Request, res: Response) {
    const { email, password, confirm_password } = req.body;
    const userRepository = getCustomRepository(UserRepository);
    
    try {
      const userAlreadyExists = await userRepository.findOne({ where: { email } })

      if (userAlreadyExists) {
        return res.status(409).json({ message: "User already exists" })
      };

      if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
      };
      
      
      const user = userRepository.create({ email, password });
      await userRepository.save(user);

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
    const userRepository = getCustomRepository(UserRepository);
    try { 
      const user = await userRepository.findOne({ where: { id: req.userId } });

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
        await userRepository.update( user.id, {
          email
        });
      };

      if (password) {
        user.password = password;
        await userRepository.save(user); 
      };


      return res.status(200).json({ user });
    } catch(err) {
      console.log(err)
      return res.status(400).json({error: "Updated failed"});
    };
  }

  async delete(req: Request, res: Response) {
    const { password_confirmation } = req.body;
    const userRepository = getCustomRepository(UserRepository);

    try {

      const user = await userRepository.findOne({ where: { id: req.userId } });


      if (!user) {
        return res.status(409).json({ message: "User not exists" });
      };

      if (!password_confirmation) {
        return res.status(400).json({ error: "Invalid password confirmation" });
      };


      const isValidPassword = await bcrypt.compare(password_confirmation, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid password" });
      };

      await userRepository.delete(user.id)

      return res.status(200).json({ message: "User deleted" });

    } catch(err) {
      return res.status(400).json({error: "Delete failed"});
    }
  };
};

export { UserController };