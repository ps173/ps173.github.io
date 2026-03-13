// ── Name Scramble ───────────────────────────────────────

(function () {
  const el = document.getElementById("hero-name");
  if (!el) return;

  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-";
  const LABELS = ["Pratham Sharma", "@mehmehsloth", "@ps173", "Pratham Sharma"];

  const SCRAMBLE_SPEED = 35; // ms per frame while a char is scrambling
  const RESOLVE_DELAY = 25; // ms between each char locking in
  const HOLD_DURATION = 2300; // ms to hold the resolved text before next cycle
  const SCRAMBLE_ITERS = 8; // random frames before a char locks

  let labelIndex = 0;
  let frameTimer = null;
  let cyclesDone = 0;
  // LABELS has 4 entries: index 0 is the starting state shown immediately,
  // so one full cycle means visiting indices 1, 2, 3 (3 transitions).
  const MAX_CYCLES = LABELS.length - 1;

  function randChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function escapeChar(c) {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    return c;
  }

  function render(resolved, scrambleCount) {
    let html = resolved.split("").map(escapeChar).join("");
    for (let i = 0; i < scrambleCount; i++) {
      html += `<span class="scramble-char">${randChar()}</span>`;
    }
    html += `<span class="cursor">_</span>`;
    el.innerHTML = html;
  }

  function scrambleTo(target, onDone) {
    const targetLen = target.length;
    let resolved = "";
    let charIndex = 0;
    let iterCount = 0;

    function frame() {
      if (charIndex >= targetLen) {
        el.innerHTML =
          target.split("").map(escapeChar).join("") +
          '<span class="cursor">_</span>';
        onDone();
        return;
      }

      iterCount++;
      const scrambleCount = Math.max(0, targetLen - resolved.length);
      render(resolved, scrambleCount);

      if (iterCount >= SCRAMBLE_ITERS) {
        resolved += target[charIndex];
        charIndex++;
        iterCount = 0;
        frameTimer = setTimeout(frame, RESOLVE_DELAY);
      } else {
        frameTimer = setTimeout(frame, SCRAMBLE_SPEED);
      }
    }

    frame();
  }

  function cycle() {
    cyclesDone++;
    labelIndex = (labelIndex + 1) % LABELS.length;
    scrambleTo(LABELS[labelIndex], () => {
      if (cyclesDone >= MAX_CYCLES) {
        // Animation complete — remove the blinking cursor so it's fully static
        el.innerHTML = LABELS[labelIndex].split("").map(escapeChar).join("");
        return;
      }
      frameTimer = setTimeout(cycle, HOLD_DURATION);
    });
  }

  el.innerHTML =
    LABELS[0].split("").map(escapeChar).join("") +
    '<span class="cursor">_</span>';
  frameTimer = setTimeout(cycle, HOLD_DURATION);
})();

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

function isMobile() {
  return window.innerWidth <= 600;
}

function getCardWidth() {
  // On mobile, cards are 100% width with gap: 0, so no gap to add.
  // On desktop, cards are 85% width with a 1.5rem (24px) gap between them.
  const gap = isMobile() ? 0 : 24;
  return cards[0].getBoundingClientRect().width + gap;
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
let dragStartY = null;
let dragStartTransform = 0;
let isDragging = false;
let isHorizontalDrag = null;

track.addEventListener("mousedown", dragStart);
track.addEventListener("touchstart", dragStart, { passive: true });

window.addEventListener("mousemove", dragMove);
window.addEventListener("touchmove", dragMove, { passive: false });

window.addEventListener("mouseup", dragEnd);
window.addEventListener("touchend", dragEnd);

function dragStart(e) {
  isDragging = true;
  dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
  dragStartY = e.touches ? e.touches[0].clientY : e.clientY;
  dragStartTransform = current * getCardWidth();
  track.style.transition = "none";
  isHorizontalDrag = null; // direction not yet determined
}

function dragMove(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const dx = Math.abs(dragStartX - x);
  const dy = Math.abs(dragStartY - y);

  // On first move, lock direction — if more vertical than horizontal, bail out
  if (isHorizontalDrag === null) {
    if (dy > dx) {
      isDragging = false;
      track.style.transition = "";
      goTo(current); // snap back cleanly
      return;
    }
    isHorizontalDrag = true;
  }

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

// ── Letterboxd RSS ─────────────────────────────────────

(async function () {
  const listEl = document.getElementById("letterboxd-list");
  if (!listEl) return;

  try {
    const res = await fetch("assets/letterboxdfeed.xml", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!res.ok) throw new Error("fetch failed");
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    const items = Array.from(xml.querySelectorAll("item")).slice(0, 8);

    if (!items.length) throw new Error("no items");

    console.log(items);

    listEl.innerHTML = items
      .map((item) => {
        // Use textContent of all children to find <link> — it sits between tags
        // so getElementsByTagName is safer than querySelector here
        const linkEl = Array.from(item.childNodes).find(
          (n) => n.nodeName === "link",
        );
        const link = linkEl ? linkEl.textContent.trim() : "#";

        const title =
          item.getElementsByTagName("title")[0]?.textContent?.trim() ?? "";
        const cleanTitle = title.replace(/,\s*\d{4}.*$/, "");

        const desc =
          item.getElementsByTagName("description")[0]?.textContent ?? "";
        const imgMatch = desc.match(/<img[^>]+src="([^"]+)"/);
        const poster = imgMatch ? imgMatch[1] : null;

        // memberRating — try both prefixed and unprefixed
        const ratingEl =
          item.getElementsByTagName("letterboxd:memberRating")[0] ??
          item.getElementsByTagName("memberRating")[0];
        const rating = ratingEl ? parseFloat(ratingEl.textContent) : null;
        const fullStars = rating ? Math.floor(rating) : 0;
        const halfStar = rating && rating % 1 >= 0.5 ? "½" : "";
        const stars = rating ? "★".repeat(fullStars) + halfStar : "";

        return `
        <li>
          <a class="lb-card" href="${link}" target="_blank" rel="noopener">
            ${
              poster
                ? `<img src="${poster}" alt="${cleanTitle}" loading="lazy" />`
                : `<div class="lb-card-img-placeholder"></div>`
            }
            <span class="lb-card-title">${cleanTitle}</span>
            ${stars ? `<span class="lb-card-rating">${stars}</span>` : ""}
          </a>
        </li>`;
      })
      .join("");
  } catch (err) {
    listEl.innerHTML = `<li class="letterboxd-error">could not load films — <a href="https://letterboxd.com/mehmehsloth/" target="_blank">view on letterboxd</a></li>`;
  }
})();
