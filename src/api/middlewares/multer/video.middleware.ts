import fs from 'fs';
import path from 'path';
import multer from 'multer';

import config from '@config';
import { Request } from 'express';
import { Logger } from 'winston';
import Container from 'typedi';

/**
 * 
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      if (fs.existsSync(config.PATH.FACEID.DATA))
        fs.rmSync(config.PATH.FACEID.DATA, { recursive: true, force: true });

      fs.mkdirSync(config.PATH.FACEID.DATA, { recursive: true });

      cb(null, config.PATH.FACEID.DATA);
    } catch (err) {
      cb(err, null);
    } finally {
      console.log('finalize')
    }
  },
  // destination: config.PATH.PYTHON.DATA,
  // destination: config.FILES.PRIVATE,

  filename: async (req, file, cb) => {
    const name = `${Math.random() + 1}`.substring(0, 20).replace(/\./g, 'a');
    const filename = `${name}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

/**
 * 
 */
const limits = {
  /** Maximum size of each form field name in bytes. (Default: 100) */
  fieldNameSize: 200,
  /** Maximum size of each form field value in bytes. (Default: 1048576) */
  fieldSize: 2048,
  /** Maximum number of non-file form fields. (Default: Infinity) */
  fields: 10,
  /** Maximum size of each file in bytes. (Default: Infinity) */
  fileSize: 100000000,
  /** Maximum number of file fields. (Default: Infinity) */
  files: 1,
  /** Maximum number of parts (non-file fields + files). (Default: Infinity) */
  // parts?: number | undefined;
  /** Maximum number of headers. (Default: 2000) */
  // headerPairs?: number | undefined;
};


/**
 * Funcion para validacion de tipo de archivo (mimetype)
 * 
 * @param req 
 * @param file 
 * @param cb 
 * @returns 
 */
const fileFilter = (
  req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback
) => {
  const Log = <Logger>Container.get('logger');
  const mimetype = ['image/png', 'image/jpg'];

  if (!mimetype.includes(file.mimetype)) {
    const err = new Error('TYPE_FILE_NOT_SUPORTED');
    Log.error(`❗⚠️ 🔥👽  Error: ${err}  👽🔥 ⚠️❗`);
    return cb(err);
  }
  cb(null, true);
};

/**
 * 
 */
export default multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});