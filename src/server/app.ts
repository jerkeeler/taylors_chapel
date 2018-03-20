import { IS_PROD, WHITELISTED_ERRORS, COOKIE_OPTS } from './consts';
import * as config from '../config.json';

import * as express        from 'express';
import * as session        from 'express-session';
import * as path           from 'path';
import * as morgan         from 'morgan';
import * as cookieParser   from 'cookie-parser';
import * as bodyParser     from 'body-parser';
import * as helmet         from 'helmet';
import * as csrf           from 'csurf';
import * as passport       from 'passport';
import { defaults }        from 'lodash';
const SequelizeStore = require('connect-session-sequelize')(session.Store);

import { apiRouter, authRouter, viewsRouter } from './routes/routers';
import { logger }         from './logging/logger';
import { db }             from './db';
import { setupPassport }  from './passport';

import { User }      from './models/User';

import * as manifest from './public/client-manifest.json';

for (let [key, value] of Object.entries(manifest)) {
  (<any>manifest)[key] = `/static/${(<any>manifest)[key]}`;
}

async function startApp() {
  logger.info('Configuring express application...');
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'pug');
  if (IS_PROD) {
    app.set('trust proxy', 1);
  }

  app.use(function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.locals.manifest = manifest;
    next();
  });

  app.use(helmet());
  app.use(helmet.referrerPolicy(
    { policy: 'no-referrer' }
  ));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser((<any>config).secretKey));
  app.use(session({
    secret: (<any>config).secretKey,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: db
    }),
    name: 'taylors-chapel-session',
    proxy: COOKIE_OPTS.proxy,
    cookie: { maxAge: COOKIE_OPTS.maxAge * 1000 }
  }));
  app.use(csrf({'cookie': defaults({
    key: 'taylors-chapel-csrf',
  }, COOKIE_OPTS)}));
  app.use(passport.initialize());
  app.use(passport.session());
  setupPassport(passport);

  // inject manifest file for every request
  app.use(function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.locals.user = req.user;
    res.locals.isAdmin = req.user ? req.user.isAdmin : false;
    res.locals._csrf = req.csrfToken();
    next();
  });

  app.use('/', viewsRouter);
  if (!IS_PROD) {
    app.use('/static/photos', express.static(path.join(__dirname, '..', (<any>config).photosFolder)))
    app.use('/static', express.static(path.join(__dirname, 'public')));
  }
  app.use('/api', apiRouter);
  app.use('/auth', authRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  logger.info('Express application configured...');

  logger.info('Connecting to database...');
  try {
    await db.authenticate();
  } catch(e) {
    logger.error('Failed to connect to database! Aborting!');
    process.exit(1);
  }
  logger.info('Connected to database!');
  return app;
}

module.exports = startApp;
