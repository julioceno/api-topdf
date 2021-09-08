import { Request, Response } from 'express';
import { getRepository } from "typeorm";

import { User } from "../models/User";

class AppController {
  async index(req: Request, res: Response) {
    return res.status(200).json({ message: "ok" });
  };
};

export { AppController };