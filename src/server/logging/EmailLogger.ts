import { IS_PROD } from '../consts';

import * as logger from 'winston';
import * as moment from 'moment';
import { emailer } from './emailer';

/**
 * Logger transport that sends an email every time it logs something. Useful
 * for when you want to send emails to an admin every time there is an
 * unhandled exception.
 */
class EmailLogger extends logger.Transport {

  timestamp: boolean;

  constructor(opts: any) {
    super(opts);
    this.name = 'emailLogger';
    this.level = opts.level || 'warn';
    this.timestamp = opts.timestamp || true;
  }

  /**
   * Log a message by sending an email
   * @param level level of the log message
   * @param msg message to log
   * @param meta metadata
   * @param callback callback after log has been written
   */
  log(level: string, msg: string, meta: any, callback: any) {
    const subject = msg.split('\n')[0];
    msg = level + ': ' + msg;
    if(this.timestamp) {
      var now = moment.utc().toDate();
      msg = now.toISOString() + ' - ' + msg;
      msg += `\n\n${meta.stack.join('\n')}`;
    }
    if(IS_PROD) {
      emailer.sendError(msg, subject);
    }
    callback(null, true);
  }

}

export { EmailLogger };
