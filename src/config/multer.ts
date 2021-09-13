import multer, { Multer } from "multer";
import path from "path";
import crypto from "crypto";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

interface StorageTypesProps {
  local: any,

  s3: any,
}

const storageTypes: StorageTypesProps = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"))
    },
    filename: (req, file: any, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err, null);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, file.key);
      });
    }
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: "upload_pdf",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)

        const fileName = `${hash.toString("hex")}-${file.originalname}`
        
        cb(null, fileName)
    })
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'), 

  storage: storageTypes.local,
}