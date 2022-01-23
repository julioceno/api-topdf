import fs from 'fs';
import sizeOf from 'image-size';
import PDFDocument from 'pdfkit';
const docxConverter = require('docx-pdf');

import { v4 as uuid } from 'uuid';
import { allowedWordMimes } from '../utils/allowedMimes';

interface PdfGeneratePros {
  name: string;
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

function pdfGenerate({ name, file }: PdfGeneratePros) {
  if (allowedWordMimes.includes(file.mimetype)) {
    const fileName = `${uuid()}-${name.replace(/ /g, '-')}.pdf`;
    const pdfurl = `./tmp/uploads/pdfs/${fileName}`;

    docxConverter(file.path, pdfurl, function (err: any, result: any) {
      if (err) {
        return console.log(err);
      }
    });

    fs.unlinkSync(file.path);
  } else {
    const dimensions = sizeOf(file.path);

    const doc = new PDFDocument({
      layout: 'landscape',
      size: [dimensions.height, dimensions.width],
    });

    const fileName = `${uuid()}-${name.replace(/ /g, '-')}.pdf`;

    const pdfurl = `./tmp/uploads/pdfs/${fileName}`;
    doc.pipe(fs.createWriteStream(pdfurl));

    doc.image(file.path, 0, 0, {
      width: dimensions.width,
      height: dimensions.height,
    });

    doc.end();

    fs.unlinkSync(file.path);
  }
}

export { pdfGenerate };
