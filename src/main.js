const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");
const toast = document.getElementById("toast");

/* ---------- Back-to-top visibility ---------- */
const toTop = document.getElementById("toTop");
const onScroll = () => toTop.classList.toggle("is-shown", window.scrollY > 600);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const setMenu = (open) => {
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);
};

navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
    setMenu(false);
    navToggle.focus();
  }
});
window.matchMedia("(min-width: 1280px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- Active section highlighting ---------- */
const navAnchors = [...document.querySelectorAll('#navLinks a[href^="#"], #sidenav a[href^="#"]')];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const href = `#${entry.target.id}`;
      navAnchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === href));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll(".reveal");
// stagger siblings that share a parent
reveals.forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  const i = siblings.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Toast ---------- */
let toastTimer;
const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 2400);
};

/* ---------- Copy email ---------- */
const copyBtn = document.getElementById("copyEmail");
copyBtn.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied to clipboard");
  } catch {
    // Fallback for insecure contexts / older browsers
    const ta = Object.assign(document.createElement("textarea"), { value: email });
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    showToast(ok ? "Email copied to clipboard" : email);
  }
});

/* ---------- CV download feedback ---------- */
document.querySelectorAll('a[download]').forEach((a) =>
  a.addEventListener("click", () => showToast("Downloading Dia Khan's CV…"))
);

/* ---------- Typed roles in hero ---------- */
const typedEl = document.getElementById("typed");
const roles = [
  "Full-Stack Developer",
  "AI-Powered Web Applications",
  "Generative AI",
  "RAG & LLM Applications",
  "FastAPI & REST APIs",
  "React & Next.js",
];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (typedEl && !reduceMotion) {
  let r = 0;
  let i = roles[0].length;
  let deleting = true;
  const tick = () => {
    const word = roles[r];
    i += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;
    if (!deleting && i === word.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && i === 0) {
      deleting = false;
      r = (r + 1) % roles.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2600);
}

/* ---------- Tools marquee: duplicate items for a seamless loop ---------- */
const track = document.getElementById("toolsTrack");
if (track) {
  [...track.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}

/* ---------- Project detail dialogs ---------- */
document.querySelectorAll("[data-dialog]").forEach((btn) => {
  const dlg = document.getElementById(btn.dataset.dialog);
  if (!dlg) return;
  btn.addEventListener("click", () => {
    dlg.showModal();
    document.body.classList.add("dialog-open");
  });
  dlg.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    btn.focus();
  });
  dlg.querySelector("[data-close]").addEventListener("click", () => dlg.close());
  // close when clicking the backdrop
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
