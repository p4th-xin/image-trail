const container = document.querySelector(".trail-container");
if (!container) throw new Error("Add <div class='trail-container'></div> in HTML");

const images = Array.from({ length: 11 }, (_, i) => `assets/img${i + 1}.jpg`);

let x = 0, y = 0;
let lastX = 0, lastY = 0;
let ready = false;
let lastTime = 0;
let lastScrollTime = 0;

const THRESHOLD = 18;   // move distance before spawning
const COOLDOWN = 50;    // ms between spawns
const PULL = 0.85;      // pull strength
const LIFE = 750;       // ms before fade out
const OUT = 600;        // fade out duration

function spawn(fromX, fromY, toX, toY) {
  const img = document.createElement("img");
  img.className = "trail-img";
  img.src = images[(Math.random() * images.length) | 0];

  const rot = (Math.random() - 0.5) * 40;
  const dx = (toX - fromX) * PULL;
  const dy = (toY - fromY) * PULL;

  img.style.left = fromX + "px";
  img.style.top = fromY + "px";
  img.style.opacity = "0";
  img.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(.9)`;
  img.style.transition = "transform 220ms cubic-bezier(.2,.9,.2,1.2), opacity 220ms";

  container.appendChild(img);

  requestAnimationFrame(() => {
    img.style.opacity = "1";
    img.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(1)`;
  });

  setTimeout(() => {
    img.style.transition = `transform ${OUT}ms ease, opacity ${OUT}ms ease`;
    img.style.opacity = "0";
    img.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg) scale(.7)`;
    setTimeout(() => img.remove(), OUT + 30);
  }, LIFE);
}

window.addEventListener("mousemove", (e) => {
  x = e.clientX; y = e.clientY;

  if (!ready) { ready = true; lastX = x; lastY = y; return; }

  const now = performance.now();
  const dx = x - lastX, dy = y - lastY;

  if (dx*dx + dy*dy > THRESHOLD*THRESHOLD && now - lastTime > COOLDOWN) {
    spawn(lastX, lastY, x, y);
    lastX = x; lastY = y;
    lastTime = now;
  }
}, { passive: true });

window.addEventListener("scroll", () => {
  if (!ready) return;

  const now = performance.now();
  if (now - lastScrollTime > 90) {
    spawn(x - 10, y - 10, x, y); // small “behind” offset
    lastScrollTime = now;
  }
}, { passive: true });