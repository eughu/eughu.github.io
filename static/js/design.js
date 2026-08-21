const revealTargets = document.querySelectorAll(".home-section, .project, .resume-section, .news-entry, .publication-card, .publication-section");
const backToTop = document.querySelector("#back-to-top");

const updateBackToTop = () => {
  if (!backToTop) return;
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.documentElement.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
}

// Binyu Mini — a lightweight, site-wide interactive research companion.
const companion = document.createElement("aside");
companion.className = "binyu-companion";
companion.setAttribute("aria-label", "Binyu Mini interactive companion");
companion.innerHTML = `
  <div class="binyu-bubble" role="status">Hi! 我是 Binyu Mini，带你逛逛我的研究 👋</div>
  <button class="binyu-close" type="button" aria-label="Hide Binyu Mini">×</button>
  <button class="binyu-pet" type="button" aria-label="Interact with Binyu Mini"><span></span></button>
  <button class="binyu-reopen" type="button" aria-label="Show Binyu Mini">BD</button>`;
document.body.append(companion);
document.body.classList.add("has-companion");

const petButton = companion.querySelector(".binyu-pet");
const petSprite = petButton.querySelector("span");
const bubble = companion.querySelector(".binyu-bubble");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let frame = 0;
let actionTimer;
let bubbleTimer;
let tracking = false;

const setSprite = (row, column) => {
  petSprite.style.backgroundPosition = `${column * -96}px ${row * -104}px`;
};

const say = (message) => {
  bubble.textContent = message;
  bubble.classList.add("is-visible");
  window.clearTimeout(bubbleTimer);
  bubbleTimer = window.setTimeout(() => bubble.classList.remove("is-visible"), 3200);
};

const play = (row, frames, speed = 150) => {
  window.clearInterval(actionTimer);
  tracking = false;
  let index = 0;
  setSprite(row, frames[index]);
  if (reduceMotion) return;
  actionTimer = window.setInterval(() => {
    index += 1;
    if (index >= frames.length) {
      window.clearInterval(actionTimer);
      tracking = true;
      setSprite(0, 0);
      return;
    }
    setSprite(row, frames[index]);
  }, speed);
};

petButton.addEventListener("click", () => {
  say(["很高兴认识你！", "一起探索合成生物学吧。", "点击页面里的研究项目看看？"][Math.floor(Math.random() * 3)]);
  play(3, [0, 1, 2, 1, 0]);
});

document.addEventListener("pointermove", (event) => {
  if (!tracking || reduceMotion || companion.classList.contains("is-hidden")) return;
  const rect = petButton.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height * .32);
  if (Math.hypot(dx, dy) < 38) return setSprite(0, 0);
  const degrees = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
  const direction = Math.round(degrees / 22.5) % 16;
  setSprite(direction < 8 ? 9 : 10, direction < 8 ? direction : direction - 8);
}, { passive: true });

companion.querySelector(".binyu-close").addEventListener("click", () => {
  companion.classList.add("is-hidden");
  document.body.classList.remove("has-companion");
});

companion.querySelector(".binyu-reopen").addEventListener("click", () => {
  companion.classList.remove("is-hidden");
  document.body.classList.add("has-companion");
  tracking = true;
  say("我回来啦！");
});

setSprite(0, 0);
window.setTimeout(() => { tracking = true; }, 900);
if (!reduceMotion) window.setInterval(() => {
  if (!tracking || companion.classList.contains("is-hidden")) return;
  frame = (frame + 1) % 6;
  if (!companion.matches(":hover")) setSprite(0, frame);
}, 900);
