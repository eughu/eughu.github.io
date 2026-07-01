const revealTargets = document.querySelectorAll(".home-section, .project, .resume-section, .news-entry, .publication-card, .publication-section");
const backToTop = document.querySelector("#back-to-top");

const updateBackToTop = () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

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
