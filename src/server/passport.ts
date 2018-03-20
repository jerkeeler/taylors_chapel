import { PassportStatic } from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';

import * as config from '../config.json';
import { User }    from './models/User';
import { logger }  from './logging/logger';
import { randomToken } from './utils';

function setupPassport(passport: PassportStatic) {
  passport.use(new OAuth2Strategy({
    clientID: (<any>config).google.clientID,
    clientSecret: (<any>config).google.clientSecret,
    callbackURL: (<any>config).google.callbackURL
  }, async function (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any) {
      try {
        let user = await User.findOne({where: {googleID: profile.id}});
        if (user === null) {
          const token = randomToken();
          user = new User({
            googleID: profile.id,
            displayName: profile.displayName,
            token: token
          });
          logger.info(`Creating new user for ${profile.displayName} with token ${token} with google ID ${profile.id}`);
          await user.save();
        } else {
          logger.info(`Logging in user: ${user.displayName} with token ${user.token}`);
        }
        return done(null, user);

      } catch (error) {
        return done(error);
      }
  }));

  passport.serializeUser((user: User, done: any) => done(null, user.id));
  passport.deserializeUser(async (id: number, done: any) => {
    const user = await User.findById(id);
    return done(null, user);
  });
}

export { setupPassport };
