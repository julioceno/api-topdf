import { Request, Response } from 'express';

class AppController {
  async index(req: Request, res: Response) {
    console.log(req.userId)
    
    return res.status(200).json({ userID: req.userId });
  };
};

export { AppController };