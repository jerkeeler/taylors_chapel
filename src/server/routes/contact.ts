import * as express from 'express';
import { emailer } from '../logging/emailer';
import { EMAIL_REGEX } from '../consts';
import { Contact } from '../models/Contact';
const config = require('../../config.json');

export async function contactPost(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const msgData = req.body;
  const validationResults = validateData(msgData);
  if (validationResults.length > 0) {
    res.status(400);
    res.json(validationResults);
  } else {
    const text = `Email: ${msgData.email}\nName: ${msgData.name}\n\n${msgData.message}`;
    const subject = `${config.contact.subject} - ${msgData.name}, ${msgData.email}`;

    const contact = new Contact({
      email: msgData.email,
      message: msgData.message,
      name: msgData.name,
    });
    try {
      await contact.save();
      let response = await emailer.send(text, subject);
      res.json({'status': 'success'});
    } catch (err) {
      res.status(400);
      res.json([config.contact.errorMsg])
    }
  }
}

/**
 * Validate all form data
 *
 * @param {any} data - Data to be validadted and submitted
 */
function validateData(data: any) {
  const validationResults = [];
  if (!validateString(data.name)) {
    validationResults.push('Name cannot be empty');
  }
  if (!validateString(data.email)) {
    validationResults.push('Email address cannot be empty');
  }
  if (!validateEmail(data.email)) {
    validationResults.push('Must provide a valid email address')
  }
  if (!validateString(data.message)) {
    validationResults.push('Message cannot be empty');
  }
  return validationResults;
}

/**
 * Determine whether it's a valid string for submissions
 *
 * @param {string} string - string to validate
 * @returns {boolean} True if valid string, false otherwise
 */
function validateString(string: string) {
  return string && string !== '';
}

/**
 * Validate an email address based on a simple regex (not perfect)
 *
 * @param {string} email - string to check if it's an email
 * @returns {boolean} True if string is an email address
 */
function validateEmail(email: string) {
  const found = email.match(EMAIL_REGEX);
  if (found) {
    return true;
  } else {
    return false;
  }
}
