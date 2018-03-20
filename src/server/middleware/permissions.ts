import * as express from 'express';

export function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.user && req.user.isAdmin)
    next();
  else
    return res.status(403).json({ message: "Forbidden" });
}

export function isLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.user)
    next();
  else
   return res.status(403).json({ message: "Forbidden" });
}
