import * as express from 'express';

import { Photo } from '../models/Photo';

const viewsRouter = express.Router();

viewsRouter.get('/', async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const photos = await Photo.findAll({
    where: {
      favorite: true
    },
    limit: 9
  });
  const photosByRow = splitPhotosIntoRows(photos)
  return res.render('index', { photos: photosByRow });
});

viewsRouter.get('/donate', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  return res.render('donate');
});

viewsRouter.get('/gallery', async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const photos: Photo[] = await Photo.findAll();
  const photosByRow = splitPhotosIntoRows(photos);
  return res.render('gallery', { photos: photosByRow });
});

viewsRouter.get('/special', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  return res.render('special-events');
});

viewsRouter.get('/admin', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  return res.render('admin');
});

function splitPhotosIntoRows(photos: Photo[]): Array<Photo[]> {
  const photosByRow: Array<Photo[]> = [];
  let row: Photo[] = [];
  photos.forEach((val, idx) => {
    if (idx % 3 === 0) {
      if (row.length) photosByRow.push(row);
      row = [val];
    } else {
      row.push(val)
    }
  });
  if (row.length !== 0)
    photosByRow.push(row);
  return photosByRow;
}

export { viewsRouter };
