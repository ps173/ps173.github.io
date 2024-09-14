const body = document.body;
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const navigationLinks = document.querySelectorAll("nav ul li a");
const themeToggleButton = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  body.classList.add(savedTheme);
  updateThemeButton();
}

themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Save theme preference in local storage
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
  } else {
    localStorage.setItem("theme", "light-mode");
  }

  updateThemeButton();
});

function updateThemeButton() {
  if (body.classList.contains("dark-mode")) {
    themeToggleButton.textContent = "🌜"; // Dark mode icon (Moon)
  } else {
    themeToggleButton.textContent = "🌞"; // Light mode icon (Sun)
  }
}

function renderNavContent() {
  if (nav.classList.contains("active")) {
    menuToggle.innerHTML = "&#215;";
  } else {
    menuToggle.innerHTML = "&#9776;";
  }
}

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  renderNavContent();
});

for (const navigationLink of navigationLinks) {
  navigationLink.addEventListener("click", () => {
    nav.classList.remove("active");
    renderNavContent();
  });
}
