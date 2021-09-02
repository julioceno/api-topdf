import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { tokenGenerate } from "../functions/tokenGenerate";

class AuthController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    const repository = getRepository(User);

    try {
      const user = await repository.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: "User not exists" });
      };
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid password" });
      };
      
      const token = tokenGenerate(user);

      return res.status(200).json({ user, token });
    } catch(err) {
      return res.status(400).json({ error: "Login failed" });
    };

  };
};

export { AuthController };