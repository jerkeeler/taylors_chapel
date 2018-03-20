import { Transporter, createTransport } from 'nodemailer';
import * as logger from 'winston';
import * as config from '../../config.json';

/**
 * Emailer class whose sole purpose is to send emails using nodemailer and
 * Google OAuth.
 */
class Emailer {

  transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  /**
   * Send an email
   * @param toAddr Email address to send to
   * @param msg Email body
   * @param subject Email subject
   */
  async _sendEmail(toAddr: string, msg: string, subject: string) {
    logger.info(`Sending email to: ${toAddr}`);
    const response = await this.transporter.sendMail({
      from: (<any>config).gmail.email,
      to: toAddr,
      subject: subject,
      text: msg,
    });
    logger.info(`Email sent to ${toAddr}: ${response.response}`);
    return response;
  }

  /**
   * Send an error email to application admin
   * @param msg Email body
   * @param subject Email subject
   */
  async sendError(msg: string, subject: string) {
    subject = `SERVER ERROR - daily-thoughts - ${subject}`;
    logger.info('Sending internal server error email');
    return await this.send(msg, subject);
  }

  /**
   * Send a normal email
   * @param msg Email body
   * @param subject Email subject
   */
  async send(msg: string, subject: string) {
    try {
      return await this._sendEmail((<any>config).contact.email, msg, subject);
    } catch (err) {
      logger.warn(`Error sending email: ${err}\n${err.stack}`);
      throw new Error(err);
    }
  }

}

/**
 * Create an emailer object
 */
function createEmailer() {
  const transporter = createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: (<any>config).gmail.email,
      clientId: (<any>config).gmail.clientId,
      clientSecret: (<any>config).gmail.clientSecret,
      accessToken: (<any>config).gmail.accessToken,
      refreshToken: (<any>config).gmail.refreshToken
    }
  });
 return new Emailer(transporter);
}

const emailer = createEmailer();

export { emailer };
