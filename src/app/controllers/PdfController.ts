import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UserRepository } from '../repositories/UserRepository';
import { PdfRepository } from '../repositories/PdfRepository';

import { pdfGenerate } from '../functions/pdfGenerate';

class PdfController {
  async store(req: Request, res: Response) {
    const { user_id } = req.params;
    const { name, text } = req.body;

    const userRepository = getCustomRepository(UserRepository);
    const pdfRepository = getCustomRepository(PdfRepository);

    console.log(req.file);

    try {
      const user = await userRepository.findOne({ id: user_id });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Name is null' });
      }

      const file = req.file;

      const pdf = pdfGenerate({ name, file });

      const pdfCreated = pdfRepository.create({
        name: pdf.name,
        pdf_url: pdf.pdfurl,
        user_id,
      });

      await pdfRepository.save(pdfCreated);

      return res.status(201).json(pdfCreated);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Created pdf failed' });
    }
  }
}
export { PdfController };
