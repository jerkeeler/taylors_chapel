let httpRequest: XMLHttpRequest, data: any, form: HTMLInputElement;
const url = '/api/contact';
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;

/**
 * Submit a new contact request
 *
 * @param {Event} evt - Form submit event
 * @returns {boolean} Succesful submition or not
 */
function submit(evt: Event) {
  evt.preventDefault();
  httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert('Your browser is too old! Like waaaaaaaaay too old.');
    return false;
  }
  disableInput();
  hideValidations();

  // Check input
  data = {
    name: (<HTMLInputElement>document.getElementsByName('name')[0]).value,
    email: (<HTMLInputElement>document.getElementsByName('email')[0]).value,
    message: (<HTMLInputElement>document.getElementsByName('message')[0]).value,
    _csrf: (<HTMLInputElement>document.getElementsByName('_csrf')[0]).value
  };

  // Send request
  displayProcessing();
  httpRequest.onreadystatechange = onSent;
  httpRequest.open('POST', url);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.send(JSON.stringify(data));
  return true;
}

/**
 * Parse response from server after sending contact form request
 */
function onSent() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    hideProcessing();
    if (httpRequest.status === 200) {
      displaySuccess();
    } else if (httpRequest.status === 400) {
      const validationResults = JSON.parse(httpRequest.responseText);
      enableInput();
      displayValidations(validationResults);
    } else {
      alert('An error occurred!');
    }
  }
}

/**
 * Disable all input fields in the contact form
 */
function disableInput() {
  const els = getFormElements();
  els.forEach((el) => el.disabled = true);
}

/**
 * Enable all input fields in the contact form
 */
function enableInput() {
  const els = getFormElements();
  els.forEach((el) => el.disabled = false);
}

/**
 * Grab all elements of the contact form
 *
 * @returns {Array} Contact form elements
 */
function getFormElements(): HTMLInputElement[] {
  const inputFields = Array.prototype.slice.call(form.getElementsByTagName('input'));
  const textFields = Array.prototype.slice.call(form.getElementsByTagName('textarea'));
  const buttons = Array.prototype.slice.call(form.getElementsByTagName('button'));
  const els = inputFields.concat(textFields).concat(buttons);
  return els;
}

/**
 * Display validation results to user
 *
 * @param {array} validationResults - Array of strings that should be displayed
 */
function displayValidations(validationResults: string[]) {
  const resultsList = document.getElementById('validation-results');
  let innerHtml = '';
  validationResults.forEach((result) => innerHtml += '<li>' + result + '</li>');
  resultsList.innerHTML = innerHtml;
  document.getElementsByClassName('validation-results is-danger')[0].classList.remove('is-hidden');
}

/**
 * Hide validations from user
 */
function hideValidations() {
  document.getElementsByClassName('validation-results is-danger')[0].classList.add('is-hidden');
}

/**
 * Show success message from server
 */
function displaySuccess() {
  document.getElementsByClassName('validation-results is-success')[0].classList.remove('is-hidden');
}

/**
 * Show the "Processing..." status message
 */
function displayProcessing() {
  document.getElementsByClassName('validation-results is-info')[0].classList.remove('is-hidden');
}

/**
 * Hide the "Processing..." status message
 */
function hideProcessing() {
  document.getElementsByClassName('validation-results is-info')[0].classList.add('is-hidden');
}

/**
 * Setup the form document by querying the DOM
 */
function setupContactForm() {
  form = document.getElementById('contact-form') as HTMLInputElement;
  if (!form) return;
  form.addEventListener('submit', submit, false);
}

export { setupContactForm };
