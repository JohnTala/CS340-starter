// Select hamburger and nav links
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('#nav-links ul');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // toggle active class
  });
}
