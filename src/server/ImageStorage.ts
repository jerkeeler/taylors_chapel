import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { StorageEngine } from 'multer';

import { Photo } from './models/Photo';

class ImageStorage implements StorageEngine {
  constructor(
    private destination: string,
    private filename: Function,
  ) { }

  private getDestination(
    req: Express.Request,
    file: Express.Multer.File,
    cb: any) {
      const [filename, token] = this.filename(file);
      cb(null, `${this.destination}${filename}`, token);
  }

  _handleFile(req: express.Request, file: Express.Multer.File, cb: any) {
    this.getDestination(req, file, function(
      err: Error,
      filepath: string,
      token: string) {
      if (err) return cb(err);

      const ext = path.extname(file.originalname);
      const bigImgPath = filepath + `${ext}`;
      const littleImgPath = filepath + `-thumb${ext}`;
      const bigResizeStream = sharp().resize(1500, 1500).max().withoutEnlargement(true);
      const littleResizeStream = sharp().resize(250, 200).max().withoutEnlargement(true);
      const bigImgStream = fs.createWriteStream(bigImgPath);
      const littleImgStream = fs.createWriteStream(littleImgPath);

      const bigPromise = new Promise((resolve, reject) => {
        (<any>file).stream
          .pipe(bigResizeStream)
          .pipe(bigImgStream);
        bigResizeStream.on('error', cb);
        bigResizeStream.on('finish', resolve);
      });
      const littlePromise = new Promise((resolve, reject) => {
        (<any>file).stream
          .pipe(littleResizeStream)
          .pipe(littleImgStream);
        littleImgStream.on('error', cb);
        littleImgStream.on('finish', resolve);
      });

      Promise.all([bigPromise, littlePromise])
        .then(async () => {
          const photo = new Photo({
            token: token,
            ext: ext
          });
          await photo.save();
          cb(null, {
            path: path,
            size: bigImgStream.bytesWritten
          });
        });
    });
  }

  _removeFile(req: express.Request, file: Express.Multer.File, cb: any) {
    fs.unlink(file.path, cb);
  }
}

export { ImageStorage };
