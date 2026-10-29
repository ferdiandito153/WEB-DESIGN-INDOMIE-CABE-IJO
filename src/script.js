const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const heroVisual = document.getElementById("heroVisual");
const productPack = document.getElementById("productPack");
const surpriseButton = document.getElementById("surpriseButton");
const surpriseResult = document.getElementById("surpriseResult");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

function updateNavbar() {
  navbar?.classList.toggle("scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

function closeMenu() {
  navLinks?.classList.remove("is-open");
  menuToggle?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Buka menu");
  document.body.classList.remove("menu-open");
}
menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  document.body.classList.toggle("menu-open", open);
});
navItems.forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 680) closeMenu();
});

if (heroVisual && productPack && canHover.matches && !reducedMotion.matches) {
  heroVisual.addEventListener("mousemove", event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    productPack.style.transform =
      `rotate(-7deg) rotateY(${x * 17 - 10}deg) rotateX(${y * -13}deg) translateZ(12px)`;
  });
  heroVisual.addEventListener("mouseleave", () => {
    productPack.style.transform = "";
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

const sections = document.querySelectorAll("#home, #story, #features, #flavor, #flavor-lab, #gallery");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const toppingIdeas = [
  { title: "THE CRUNCH", description: "Tambahkan bawang goreng dan irisan daun bawang." },
  { title: "THE FRESH", description: "Coba paduan sayuran segar dan perasan jeruk limau." },
  { title: "THE PROTEIN", description: "Lengkapi sajian dengan telur matang sesuai selera." },
  { title: "THE SPICY", description: "Eksplorasi cabai tambahan sesuai toleransi pedasmu." },
  { title: "YOUR SIGNATURE", description: "Pilih topping favoritmu dan ciptakan versi sendiri." }
];
let lastIdea = -1;
surpriseButton?.addEventListener("click", () => {
  let index;
  do { index = Math.floor(Math.random() * toppingIdeas.length); }
  while (index === lastIdea && toppingIdeas.length > 1);
  lastIdea = index;
  const idea = toppingIdeas[index];
  surpriseResult.textContent = `${idea.title} — ${idea.description}`;
  surpriseButton.innerHTML = 'Ide Lainnya <span>↻</span>';
});

if (canHover.matches && !reducedMotion.matches) {
  document.querySelectorAll(".feature-card").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.transform = `translateY(-8px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

const flavorMoods = {
  bold: {
    number: "01", emoji: "🌶️", kicker: "THE BOLD SIDE",
    title: "BERANI JADI DIRI SENDIRI.",
    description: "Untuk kamu yang suka rasa dengan karakter kuat. Cabai hijau menjadi inspirasi untuk pengalaman mi goreng yang terasa berbeda.",
    counter: "FLAVOR 01 / 03"
  },
  savory: {
    number: "02", emoji: "🍜", kicker: "THE COMFORT SIDE",
    title: "GURIH YANG SELALU DIRINDUKAN.",
    description: "Momen sederhana, rasa yang familiar, dan waktu makan yang jadi jeda menyenangkan di tengah kesibukan.",
    counter: "FLAVOR 02 / 03"
  },
  fresh: {
    number: "03", emoji: "🍋", kicker: "THE FRESH SIDE",
    title: "KASIH SENTUHAN BERBEDA.",
    description: "Eksplorasi sajianmu dengan sayuran segar atau perasan jeruk limau untuk sentuhan yang lebih personal.",
    counter: "FLAVOR 03 / 03"
  }
};
const moodButtons = document.querySelectorAll(".mood-button");
const labNumber = document.getElementById("labNumber");
const labIngredient = document.getElementById("labIngredient");
const moodKicker = document.getElementById("moodKicker");
const moodTitle = document.getElementById("moodTitle");
const moodDescription = document.getElementById("moodDescription");
const moodCounter = document.getElementById("moodCounter");
const moodContent = document.querySelector(".mood-description");

moodButtons.forEach(button => {
  button.addEventListener("click", () => {
    const mood = flavorMoods[button.dataset.mood];
    if (!mood) return;
    moodButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    labNumber.textContent = mood.number;
    labIngredient.textContent = mood.emoji;
    moodKicker.textContent = mood.kicker;
    moodTitle.textContent = mood.title;
    moodDescription.textContent = mood.description;
    moodCounter.textContent = mood.counter;
    moodContent.style.animation = "none";
    void moodContent.offsetWidth;
    moodContent.style.animation = "mood-enter .4s ease";
  });
});

console.log("Indomie Cabe Ijo landing page ready!");
