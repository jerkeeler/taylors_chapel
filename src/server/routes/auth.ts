import * as express  from 'express';
import * as passport from 'passport';

import { GOOGLE_SCOPE } from '../consts';

const authRouter = express.Router();

authRouter.get('/login', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.redirect('/auth/google');
});

authRouter.get('/logout', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  req.logout();
  res.redirect('/');
});

authRouter.get('/google',
  passport.authenticate('google', { scope: GOOGLE_SCOPE }));

authRouter.get('/google/callback',
  passport.authenticate('google'),
  function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.redirect('/admin');
  }
);

export { authRouter };
