// Пряничный двор — витрина магазина

/* ---------- Каталог: данные ---------- */
// Товары выгружены из магазина бренда «Яркий пряник» на Wildberries.
// Фото лежат в media/products/. Обновить каталог = обновить этот массив + фото.
const MEDIA = "media/products/";
const PRODUCTS = [
  { name:"Пряники на торт динозаврики", price:527, old:1300, rating:4.9, reviews:166, cat:"other", img:"295888663.webp", tile:"t-honey", badge:"sale", disc:59 },
  { name:"Имбирные пряники «Щенячий патруль»", price:570, old:2200, rating:4.8, reviews:464, cat:"hero", img:"174038071.webp", tile:"t-orange", badge:"hit" },
  { name:"Пряники «Kuromi и Мелоди» для торта", price:535, old:2000, rating:4.8, reviews:241, cat:"hero", img:"279569982.webp", tile:"t-berry", badge:"sale", disc:73 },
  { name:"Пряники на торт «Фиксики»", price:535, old:2200, rating:4.7, reviews:140, cat:"hero", img:"281016608.webp", tile:"t-mint", badge:"sale", disc:76 },
  { name:"Пряники на торт «Холодное сердце»", price:374, old:2000, rating:4.9, reviews:80, cat:"hero", img:"281026889.webp", tile:"t-blue", badge:"sale", disc:81 },
  { name:"Имбирные пряники «Трактор»", price:502, old:2000, rating:4.8, reviews:164, cat:"boy", img:"174034773.webp", tile:"t-lilac", badge:"sale", disc:75 },
  { name:"Имбирные пряники «Три кота», набор на торт", price:517, old:2200, rating:4.7, reviews:321, cat:"hero", img:"174032047.webp", tile:"t-honey", badge:"hit" },
  { name:"Набор пряников «Человек-паук», 6 шт на торт", price:442, old:2100, rating:4.9, reviews:101, cat:"hero", img:"281031742.webp", tile:"t-orange", badge:"sale", disc:79 },
  { name:"Пряники на торт для девочки 14 лет", price:413, old:2300, rating:5, reviews:8, cat:"girl", img:"498237933.webp", tile:"t-berry", badge:"new" },
  { name:"Пряники на торт «Дачнику»", price:510, old:2100, rating:4.9, reviews:147, cat:"other", img:"223755570.webp", tile:"t-mint", badge:"sale", disc:76 },
  { name:"Пряники на торт «Машинки»", price:493, old:2100, rating:4.7, reviews:103, cat:"boy", img:"281034830.webp", tile:"t-blue", badge:"sale", disc:77 },
  { name:"Имбирные пряники «Строительные машинки»", price:410, old:2100, rating:4.6, reviews:59, cat:"boy", img:"177418126.webp", tile:"t-lilac", badge:"sale", disc:80 },
  { name:"Имбирные пряники на торт «Футбол»", price:367, old:1470, rating:4.8, reviews:55, cat:"boy", img:"177689786.webp", tile:"t-honey", badge:"sale", disc:75 },
  { name:"Пряники на торт для девочки", price:304, old:2000, rating:4.4, reviews:5, cat:"girl", img:"498237934.webp", tile:"t-orange", badge:"new" },
];
const BADGE_TXT = { hit: "Хит", new: "Новинка" };

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
let activeCat = "all";
let query = "";

function render() {
  const q = query.trim().toLowerCase();
  const items = PRODUCTS.filter(p =>
    (activeCat === "all" || p.cat === activeCat) &&
    (q === "" || p.name.toLowerCase().includes(q))
  );
  grid.innerHTML = items.map(p => `
    <article class="card ${p.tile}">
      <div class="card-media">
        ${p.badge === "sale"
          ? `<span class="badge sale">−${p.disc}%</span>`
          : p.badge ? `<span class="badge ${p.badge}">${BADGE_TXT[p.badge]}</span>` : ""}
        ${p.img
          ? `<img src="${MEDIA}${p.img}" alt="${p.name}" loading="lazy">`
          : `<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#${p.sym}"/></svg>`}
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        ${p.rating ? `<div class="rating"><span class="star">★</span> ${p.rating} · ${p.reviews} отз.</div>` : ""}
        <div class="price"><b>${p.price} ₽</b>${p.old ? `<s>${p.old} ₽</s>` : ""}</div>
        <button class="add" type="button" data-name="${p.name}">В корзину</button>
      </div>
    </article>`).join("");
  empty.hidden = items.length > 0;
}

/* ---------- Фильтр по категориям ---------- */
document.getElementById("chips").addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  activeCat = btn.dataset.cat;
  render();
});

// плитки категорий над каталогом
document.querySelectorAll(".cat-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    activeCat = tile.dataset.cat;
    query = "";
    document.getElementById("search").value = "";
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-active", c.dataset.cat === activeCat));
    render();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });
});

/* ---------- Поиск ---------- */
document.getElementById("search").addEventListener("input", e => {
  query = e.target.value;
  render();
});

/* ---------- Корзина ---------- */
let cart = 0;
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
grid.addEventListener("click", e => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  cart++;
  cartCount.textContent = cart;
  cartCount.hidden = false;
  btn.classList.add("added");
  btn.textContent = "Добавлено ✓";
  setTimeout(() => { btn.classList.remove("added"); btn.textContent = "В корзину"; }, 1200);
  showToast(`«${btn.dataset.name}» в корзине · всего ${cart}`);
});
document.getElementById("cartBtn").addEventListener("click", e => {
  if (cart === 0) { e.preventDefault(); showToast("Корзина пуста — загляните в каталог 🍪"); }
  else showToast(`В корзине ${cart} ${plural(cart, ["товар","товара","товаров"])} — оформление скоро`);
});
function plural(n, f) { const m = n % 100, k = n % 10; return m > 10 && m < 20 ? f[2] : k === 1 ? f[0] : k >= 2 && k <= 4 ? f[1] : f[2]; }

/* ---------- Тема ---------- */
(function () {
  const root = document.documentElement;
  document.getElementById("themeBtn").addEventListener("click", () => {
    let cur = root.getAttribute("data-theme");
    if (!cur) cur = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
  });
})();

/* ---------- Форма ---------- */
document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  showToast("Спасибо! Заявка отправлена — свяжемся сегодня 🍯");
  e.target.reset();
});

/* ---------- Появление секций ---------- */
(function () {
  const els = document.querySelectorAll(".sec-head, .trust-grid, .corp-card, .review, details");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  els.forEach(e => { e.classList.add("reveal"); });
  const io = new IntersectionObserver(ent => {
    ent.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
})();

/* инициализация каталога */
render();
