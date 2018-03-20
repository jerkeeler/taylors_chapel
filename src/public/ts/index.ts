import { burgerToggle } from './burgerToggle';
import { setupContactForm } from './contact';

burgerToggle();
setupContactForm();
const now = new Date();
const copyrightYearID = 'copyright-year';
document.getElementById(copyrightYearID).innerHTML = ` ${now.getFullYear()}`;

const elements = ['history', 'gallery', 'location', 'contact'];

if (document.getElementById('page-arrow')) {
  document.getElementById('page-arrow').addEventListener('click', () => {
    const positions = getScrollElPositions();
    if (positions.length === 0 || atBottom())
      scrollToPos(0);
    else {
      const target = positions.reduce((acc, curr) => curr[0] < acc[0] ? curr : acc);
      scrollToElement(elements[target[1]]);
    }
  });

  window.addEventListener('scroll', onResize);
  window.addEventListener('resize', onResize);
  document.addEventListener('DOMContentLoaded', onResize);
}

function getScrollElPositions(): Array<number[]> {
  const topOfPage = getCurrentYPos();
  let positions = elements.map((elId, idx) => {
    return [document.getElementById(elId).offsetTop - topOfPage, idx];
  });
  positions = positions.filter(el => el[0] > 20);
  return positions;
}

function onResize() {
  const positions = getScrollElPositions();
  const pageArrow = document.getElementById('page-arrow');
  if (atBottom() || positions.length === 0) {
    pageArrow.classList.remove('fa-angle-down');
    pageArrow.classList.add('fa-angle-up');
  } else {
    pageArrow.classList.remove('fa-angle-up');
    pageArrow.classList.add('fa-angle-down');
  }
}

function atBottom(): boolean {
  return (window.innerHeight + window.scrollY) >= document.body.offsetHeight
}

function scrollToElement(elId: string) {
  const currentTop = getCurrentYPos();
  const targetTop = document.getElementById(elId).offsetTop - 20;
  smoothScroll(currentTop, targetTop);
}

function scrollToPos(pos: number) {
  const currentTop = getCurrentYPos();
  smoothScroll(currentTop, pos);
}

function getCurrentYPos(): number {
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
      return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function smoothScroll(startY: number, stopY: number) {
  const distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY); return;
  }
  let speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  const step = Math.round(distance / 25);
  const leapY = stopY > startY ? startY + step : startY - step;
  stepper(leapY, step, speed);

  function stepper(leapY: number, step: number, speed:  number) {
    if (stopY > startY)
      leapY > stopY ? leapY = stopY : leapY += step;
    else
      leapY < stopY ? leapY = stopY : leapY -= step;

    window.scrollTo(0, leapY);

    if (stopY > startY && leapY > stopY) {
      window.scrollTo(0, stopY);
      return;
    } else if (stopY < startY && leapY < stopY) {
      window.scrollTo(0, stopY);
      return;
    }
    setTimeout(() => stepper(leapY, step, speed), speed);
  }
}

const form = <HTMLFormElement>document.getElementById('photo-upload');

if (form) {
  const fileInput  = <HTMLInputElement>document.getElementById('photos-input');
  form.addEventListener('submit', (ev) => {
    const file = fileInput.files[0];
    const oData = new FormData(form);
    const oReq = new XMLHttpRequest();
    const _csrf = (<HTMLInputElement>document.getElementById('photos-csrf')).value;
    oReq.open('POST', '/api/photos/upload?_csrf=' + _csrf, true);

    oReq.onload = function () {
      document.getElementById('upload-success').classList.remove('is-hidden');
      document.getElementById('upload-pending').classList.add('is-hidden');
      fileInput.value = '';
      document.getElementById('photos-input-names').innerHTML = 'No Files Selected';
    };
    oReq.send(oData);
    document.getElementById('upload-pending').classList.remove('is-hidden');
    ev.preventDefault();
  }, false);

  fileInput.onchange = function () {
    if(fileInput.files.length > 0)
      document.getElementById('photos-input-names').innerHTML = Array.from(fileInput.files).map(file => file.name).join(', ');
    else
      document.getElementById('photos-input-names').innerHTML = 'No Files Selected';
  };
}

const imgModals = document.getElementsByClassName('gallery-full-img');
for (let i = 0; i < imgModals.length; i++) {
  const img = new Image();
  const el = imgModals.item(i);
  const src = el.getAttribute('data-async-src');
  img.onload = () => el.setAttribute('src', src);
  img.src = src;
}

const imgThumbs = document.getElementsByClassName('img-item');
for (let i = 0; i <imgThumbs.length; i++) {
  const el = imgThumbs.item(i);
  el.addEventListener('click', () => {
    const targetMdl = el.getAttribute('data-target');
    document.getElementById(targetMdl).classList.add('is-active');
  });
}

const modalBgs = Array.from(document.getElementsByClassName('modal-background'));
const closeBtns = Array.from(document.getElementsByClassName('modal-close'));
const closeEls = modalBgs.concat(closeBtns);
closeEls.forEach(el => {
  el.addEventListener('click', () => {
    Array.from(document.getElementsByClassName('modal')).forEach(el => el.classList.remove('is-active'));
  });
})

window.addEventListener('keyup', (evt: KeyboardEvent) => {
  if (evt.keyCode === 27)
    Array.from(document.getElementsByClassName('modal')).forEach(el => el.classList.remove('is-active'));
});

const favFlags = Array.from(document.getElementsByClassName('fav-flag'));
favFlags.forEach(el => {
  el.addEventListener('click', async (evt: Event) => {
    evt.stopPropagation();
    const target = el.getAttribute('data-target');
    const action = el.getAttribute('data-action');
    const url = `/api/photos/${target}/${action}`;
    await getRequest(url);
    if (action === 'unfav') {
      el.classList.remove('fa-flag');
      el.classList.add('fa-flag-o');
      el.setAttribute('data-action', 'fav');
    } else if (action === 'fav') {
      el.classList.remove('fa-flag-o');
      el.classList.add('fa-flag');
      el.setAttribute('data-action', 'unfav');
    }
  });
});

function getRequest(url): Promise<any> {
  return new Promise((resolve, reject) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url);
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200)
          resolve();
        else
          reject();
      }
    };
    httpRequest.send();
  });
}
