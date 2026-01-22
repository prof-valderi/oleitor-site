(function(){
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if(!btn || !nav) return;

  function setExpanded(isOpen){
    btn.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
  }

  // estado inicial (fechado)
  setExpanded(false);

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setExpanded(!isOpen);
  });

  // fecha ao clicar em um item do menu (melhor UX no celular)
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if(!a) return;
    if(window.matchMedia("(max-width: 900px)").matches){
      setExpanded(false);
    }
  });
})();

// ===== Contador de visitas (Counter.dev + badge visível) =====
(function () {

  /* --- Counter.dev (analytics, sem exibição) --- */
  if (!document.getElementById("counter-dev-script")) {
    const s = document.createElement("script");
    s.id = "counter-dev-script";
    s.src = "https://cdn.counter.dev/script.js";
    s.setAttribute("data-id", "73609e1b-9816-441a-8489-8b5e8f015ee4");
    s.setAttribute("data-utcoffset", "-3");
    s.async = true;
    document.body.appendChild(s);
  }


