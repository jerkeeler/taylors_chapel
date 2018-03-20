import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import { randomToken } from '../utils';
import { contactPost } from './contact';
import { isAdmin } from '../middleware/permissions';
import * as config from '../../config.json';

import { ImageStorage } from '../ImageStorage';
import { Photo } from '../models/Photo';

const storage = new ImageStorage(
  (<any>config).photosFolder,
  (file: Express.Multer.File) => {
    const token = randomToken();
    return [`photo-${token}`, token]
  }
);
const upload = multer({ storage: storage });
const apiRouter = express.Router();

apiRouter.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const output = req.user ? req.user.displayName : 'NOOOOO!';
  return res.json({ user: output });
});

apiRouter.get('/healthcheck', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  return res.json({ status: 'success' })
});

apiRouter.post('/photos/upload',
  isAdmin,
  upload.array('photos', 12),
  function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    return res.json({ status: 'success' });
  });

apiRouter.get('/photos/:token/fav',
  isAdmin,
  async function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const photo = await Photo.findOne({
      where: {
        token: req.params.token
      }
    });
    photo.favorite = true;
    await photo.save();
    return res.json({ status: 'success' });
  });

apiRouter.get('/photos/:token/unfav',
  isAdmin,
  async function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const photo = await Photo.findOne({
      where: {
        token: req.params.token
      }
    });
    photo.favorite = false;
    await photo.save();
    return res.json({ status: 'success' });
  });


apiRouter.post('/contact', contactPost);
export { apiRouter };
