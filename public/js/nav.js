const hamburger = document.querySelector(".hamburger");
const navList = document.querySelector("#nav-links ul");

if (hamburger && navList) {
  hamburger.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}
