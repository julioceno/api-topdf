import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import bcrypt from "bcryptjs";

import { UserRepository } from '../repositories/UserRepository';
import { tokenGenerate } from "../functions/tokenGenerate";
import { transport } from "../../resources/mailer"

class AuthController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    const userRepository = getCustomRepository(UserRepository);

    try {
      const user = await userRepository.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ error: "User not exists" });
      };
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid password" });
      };
      
      const token = tokenGenerate(user);
      
      delete user.password;
      delete user.password_reset_expires;
      delete user.password_reset_token;

      return res.status(200).json({ user, token });
    } catch(err) {
      return res.status(400).json({ error: "Login failed" });
    };

  };
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const userRepository = getCustomRepository(UserRepository);
   
    try {
      const user = await userRepository.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }; 

      let code;
      while(String(code).length !== 6 && !/^-$/i.test(String(code))) {
        code = String(Math.floor(Math.random() * 999999));
      };

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await userRepository.update( user.id, { 
        password_reset_token: code,
        password_reset_expires: now,
      });
      const mailOptions  = {
        to: email,
        from: "julio@gmail.com",
        template: "/auth/forgot_password",
        context: { code }
      }

      transport.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err)
          return res.status(400).json({ error: "Cannot json forgot password email" });
        };

        return res.status(200).json({ sucess: "token sent"});
      })
      
    } catch(err) {
      console.log(err)
      res.status(400).json({ error: "Erro on forgot password, try again" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email, code, password } = req.body;
    const userRepository = getCustomRepository(UserRepository);

    try {
      const user = await userRepository.findOne({ email });

      if (!user) {
        return res.status(400).send({ error: "User not found"});
      };
    
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        return res.status(400).send({ error: "Your new password must be different from the old one"});
      };
     
      if (code !== user.password_reset_token) {
        return res.status(400).json({ error: "Code invalid" });
      };

      const now = new Date();

      if ( user.password_reset_expires && now > user.password_reset_expires) {
        return res.status(400).json({ error: "Code expired" });
      };

      /* Atualmente o unico jeito de acionar o hook do typeorm de update ?? salvando novamente o usu??rio */
      user.password = password;
      await userRepository.save(user); 

      /* Aqui eu deixo nulo o tempo de reset do token e deixo nulo o proprio token, n??o fa??o isso com query  
      anterior pois daria um erro de tipos do typescript. */
      await userRepository.update(user.id, {
        password_reset_expires: null,
        password_reset_token: null
      });

      delete user.password;
      delete user.password_reset_expires;
      delete user.password_reset_token;

      return res.status(200).json(user);
    } catch(err) {
      return res.status(400).json({ error: "Cannot reset password, try again" });
    }
  };
};

export { AuthController };