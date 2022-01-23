import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UserRepository } from '../repositories/UserRepository';
import { PdfRepository } from '../repositories/PdfRepository';

import { pdfGenerate } from '../functions/pdfGenerate';

class PdfController {
  async store(req: Request, res: Response) {
    const { userId } = req;

    const { name } = req.body;

    const userRepository = getCustomRepository(UserRepository);
    const pdfRepository = getCustomRepository(PdfRepository);

    console.log(req.file);

    try {
      const user = await userRepository.findOne({ id: userId });

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
        user_id: userId,
      });

      await pdfRepository.save(pdfCreated);

      return res.status(201).json(pdfCreated);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Created pdf failed' });
    }
  }

  async delete(req: Request, res: Response) {
    const { userId } = req;
    const { pdf_id } = req.params;

    const userRepository = getCustomRepository(UserRepository);
    const pdfRepository = getCustomRepository(PdfRepository);

    try {
      const user = await userRepository.findOne({ id: userId });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!pdf_id) {
        return res.status(400).json({ error: 'Id pdf not specified' });
      }

      const pdfExists = await pdfRepository.findOne(pdf_id);

      if (!pdfExists) {
        return res.status(400).json({ error: 'Pdf not exists' });
      }

      await pdfRepository.delete(pdf_id);

      return res.status(200).json({ message: 'Pdf deleted' });
    } catch (err) {
      return res.status(400).json({ error: 'Delete failed' });
    }
  }
}
export { PdfController };
