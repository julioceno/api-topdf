import { Request, Response } from "express";

class AuthController {
  async register(req: Request, res: Response) {

    try {
      
      return res.json({message: "hello world"});
    } catch(err) {
      return res.status(400).json({error: "Registration failed"});
    }
  };
};

export { AuthController };