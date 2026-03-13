// ── Theme ──────────────────────────────────────────────

const body = document.body;
const themeToggleButton = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.classList.add(savedTheme);
  updateThemeButton();
}

themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    body.classList.contains("dark-mode") ? "dark-mode" : "light-mode",
  );
  updateThemeButton();
});

function updateThemeButton() {
  themeToggleButton.textContent = body.classList.contains("dark-mode")
    ? "🌜"
    : "🌞";
}

// ── Carousel ───────────────────────────────────────────

const track = document.getElementById("carousel-track");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
const currentEl = document.getElementById("carousel-current");
const totalEl = document.getElementById("carousel-total");
const cards = Array.from(track.querySelectorAll(".card"));

const total = cards.length;
let current = 0;

totalEl.textContent = total;

function getCardWidth() {
  // card width + gap (1.5rem = 24px)
  return cards[0].getBoundingClientRect().width + 24;
}

function goTo(index) {
  current = Math.max(0, Math.min(index, total - 1));
  track.style.transform = `translateX(-${current * getCardWidth()}px)`;
  currentEl.textContent = current + 1;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === total - 1;
}

// Init
goTo(0);

// Arrow buttons
prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

// Keyboard — only when the projects section is in view
document.addEventListener("keydown", (e) => {
  const section = document.getElementById("work");
  const rect = section.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (!inView) return;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    goTo(current + 1);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    goTo(current - 1);
  }
});

// Swipe / drag
let dragStartX = null;
let dragStartTransform = 0;
let isDragging = false;

track.addEventListener("mousedown", dragStart);
track.addEventListener("touchstart", dragStart, { passive: true });

window.addEventListener("mousemove", dragMove);
window.addEventListener("touchmove", dragMove, { passive: false });

window.addEventListener("mouseup", dragEnd);
window.addEventListener("touchend", dragEnd);

function dragStart(e) {
  isDragging = true;
  dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
  dragStartTransform = current * getCardWidth();
  track.style.transition = "none";
}

function dragMove(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const delta = dragStartX - x;
  const raw = dragStartTransform + delta;
  const min = 0;
  const max = (total - 1) * getCardWidth();
  let clamped;
  if (raw < min) {
    clamped = min - Math.sqrt(Math.abs(raw - min)) * 6;
  } else if (raw > max) {
    clamped = max + Math.sqrt(Math.abs(raw - max)) * 6;
  } else {
    clamped = raw;
  }
  track.style.transform = `translateX(-${clamped}px)`;
  if (e.cancelable) e.preventDefault();
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = "";

  const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const delta = dragStartX - x;
  const threshold = getCardWidth() * 0.2;

  if (delta > threshold) {
    goTo(current + 1);
  } else if (delta < -threshold) {
    goTo(current - 1);
  } else {
    goTo(current);
  }
}

// Recalculate on resize
window.addEventListener("resize", () => goTo(current));
