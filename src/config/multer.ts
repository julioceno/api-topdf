import { Request } from "express";
import multer from "multer";
import path from "path";

import { v4 as uuid } from "uuid";

import { allowedAllMimes } from "../app/utils/allowedMimes";

interface FileProps {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string
}


const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads', 'files'))
    }, 
    filename: (req: Request, file: FileProps, cb: Function) => {
      const name = `${uuid()}-${file.originalname}`
      cb(null, name);
    },
  }),
  
  s3: ""
}

interface typeProps {
  local: string,
  s3: string
}


function multerConfig() {
  return {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads', 'files'),
    storage: storageTypes["local"],
    fileFilter: (req: Request, file: FileProps, cb: Function) => {
      if (allowedAllMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
  };
};

export { multerConfig };