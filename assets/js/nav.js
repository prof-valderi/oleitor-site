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
