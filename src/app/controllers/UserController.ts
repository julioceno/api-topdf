import { Request, Response } from 'express';
import { getRepository } from "typeorm";

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
};

export { UserController };
/* 
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

const token = tokenGenerate(user)

return res.status(201).json({ user, token }); */