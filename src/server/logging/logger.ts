import { IS_PROD, LOG_LEVEL, MAX_LOG_SIZE, MAX_LOG_FILES } from '../consts';
import { defaults } from 'lodash';

import * as logger from 'winston';
import { Transport } from 'nodemailer';
import { EmailLogger } from './EmailLogger';

const defaultLogOpts = {
  timestamp: true,
  maxsize: MAX_LOG_SIZE,
  maxFiles: MAX_LOG_FILES,
  colorize: false,
  handleExceptions: false,
  json: false
};

const transports: (logger.FileTransportInstance |
                   EmailLogger |
                   logger.ConsoleTransportInstance)[] = [
  new logger.transports.File(defaults({
    name: 'info-file',
    filename: './logs/app.log',
    level: 'info',
  }, defaultLogOpts)),
  new logger.transports.File(defaults({
    name: 'error-file',
    filename: './logs/error.log',
    level: 'warn',
    handleExceptions: true
  }))
];

if (!IS_PROD) {
  transports.push(new logger.transports.Console(defaults({
    level: 'debug',
    handleExceptions: true,
    colorize: true
  })));
}

logger.configure({
  transports: transports,
  level: LOG_LEVEL
});

export { logger };
