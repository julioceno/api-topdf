import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

const PDFDocument = require('pdfkit');
const doc = new PDFDocument();

import { User } from '../models/User';

class AppController {
  async index(req: Request, res: Response) {
    return res.status(200).json({ message: req.userId });
  }

  async create_pdf(req: Request, res: Response) {
    try {
      const pdf = doc
        .image(__dirname + '/../pdfs/image.png', 0, 15, { width: 300 })
        .text('Proportional to width', 0, 0);

      return res.status(200).json({ message: 'pdf ready' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'Convert pdf failed' });
    }
  }
}

export { AppController };
