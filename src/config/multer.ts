import { Request } from 'express';
import multer from 'multer';
import path from 'path';

import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

import { v4 as uuid } from 'uuid';

import { allowedAllMimes } from '../app/utils/allowedMimes';

interface FileProps {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
}

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads', 'files'));
    },
  }),
};

function multerConfig() {
  process.env.STORAGE_TYPE;

  if (!process.env.STORAGE_TYPE) throw new Error('Storage type not specified');

  return {
    storage: storageTypes['local'],
    fileFilter: (req: Request, file: FileProps, cb: Function) => {
      if (allowedAllMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    },
  };
}

export { multerConfig };
