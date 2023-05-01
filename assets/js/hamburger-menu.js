document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButtons = document.querySelectorAll(".hamburger-menu");
  for (const btn of hamburgerButtons) {
    btn.onclick = (event) => {
      const menus = document.querySelectorAll(".hamburger-menu-list");
      for (const menu of menus) {
        menu.classList.toggle("navbar__menu--hidden");
      }
    };
  }
})
