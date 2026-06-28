(() => {
  const root = document.querySelector(".landing-page");

  if (!root) {
    return;
  }

  const fadeItems = root.querySelectorAll(".fade-in");

  const revealOnScroll = () => {
    fadeItems.forEach((item) => {
      const rect = item.getBoundingClientRect();

      if (rect.top < window.innerHeight - 80) {
        item.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("load", revealOnScroll);
  revealOnScroll();

  const accordionItems = root.querySelectorAll(".faq-item");

  accordionItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        accordionItems.forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
      }
    });
  });
})();
