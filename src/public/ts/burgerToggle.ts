function burgerToggle() {
  const navBurger = document.getElementsByClassName('navbar-burger')[0];
  if (navBurger) {
    navBurger.addEventListener('click', () => {
      const target = document.getElementById(navBurger.getAttribute('data-target'));
      target.classList.toggle('is-active');
      navBurger.classList.toggle('is-active');
    });
  }
}

export { burgerToggle };
