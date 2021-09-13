import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";

import { UserRepository } from '../repositories/UserRepository';
import { PdfRepository } from '../repositories/PdfRepository';

class PdfController {
  async store(req: Request, res: Response) {
    const { user_id } = req.params;
    const { name } = req.body;

    const userRepository = getCustomRepository(UserRepository);
    const pdfRepository = getCustomRepository(PdfRepository);
    
    try {
      const user = await userRepository.findOne({ id: user_id });
      
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      };

      if (!name) {
        return res.status(400).json({ error: "Name is null" });
      };

      const pdf = pdfRepository.create({
        name,
        pdf_url: ""
      });

      await pdfRepository.save(pdf)

      return res.status(201).json({ message: "created" });
    } catch(err) {
      console.log(err)
      return res.status(400).json({ message: "Created pdf failed" });
    };
  };

}
export { PdfController };