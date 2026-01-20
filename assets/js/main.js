function $(sel){ return document.querySelector(sel); }
function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function fmtBRDate(iso){
  // iso: "YYYY-MM-DD"
  const [y,m,d] = iso.split("-").map(Number);
  return `${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y}`;
}
function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
}
function setHeader(){
  const d = window.OLEITOR_DATA;
  $("#siteName") && ($("#siteName").textContent = d.site.nome);
  $("#siteSub") && ($("#siteSub").textContent = d.site.subtitulo);
  $("#siteISSN") && ($("#siteISSN").textContent = d.site.issn);
}
function renderEdicaoAtual(){
  const d = window.OLEITOR_DATA;
  const box = $("#edicaoAtualBox");
  if(!box) return;

  const titulo = escapeHtml(d.edicaoAtual.titulo);
  const pdf = d.edicaoAtual.pdf;

  box.innerHTML = `
    <div class="card">
      <h2>${titulo}</h2>
      <p class="muted">Leitura online do PDF do mês.</p>
      <div class="list">
        <div class="item">
          <div class="left">
            <strong>PDF do mês</strong>
            <span class="muted">${escapeHtml(d.edicaoAtual.mes)}/${d.edicaoAtual.ano}</span>
          </div>
          <div class="right">
            <a class="pill primary" href="${pdf}" target="_blank" rel="noopener">Abrir em nova aba</a>
            <a class="pill" href="${pdf}" download>Baixar PDF</a>
          </div>
        </div>
      </div>
      <hr>
      <iframe class="pdf-frame" src="${pdf}#view=FitH" title="PDF da edição atual"></iframe>
      <p class="muted">Se o PDF não aparecer, use “Abrir em nova aba” ou “Baixar PDF”.</p>
    </div>
  `;
}
function renderArquivo(){
  const d = window.OLEITOR_DATA;
  const box = $("#arquivoBox");
  if(!box) return;

  const items = d.edicoes.map(e=>{
    const label = `${escapeHtml(e.mes)}/${e.ano}`;
    const filename = e.pdf.split("/").pop();
    return `
      <div class="item">
        <div class="left">
          <strong>${label}</strong>
          <span class="muted">${escapeHtml(filename)}</span>
        </div>
        <div class="right">
          <a class="pill" href="${e.pdf}" target="_blank" rel="noopener">Visualizar</a>
          <a class="pill primary" href="${e.pdf}" download>Baixar</a>
        </div>
      </div>
    `;
  }).join("");

  box.innerHTML = `
    <div class="card">
      <h2>Arquivo de Edições</h2>
      <p class="muted">
        Clique em <b>Baixar</b> para abrir o diálogo do navegador (Salvar/Download).
      </p>
      <div class="list">${items}</div>
    </div>
  `;
}
function renderPatrono(){
  const d = window.OLEITOR_DATA;
  $("#patronoNome") && ($("#patronoNome").textContent = d.patrono.nome);
  $("#patronoBio") && ($("#patronoBio").textContent = d.patrono.biografia);
  const img = $("#patronoFoto");
  if(img){
    img.src = d.patrono.foto;
    img.alt = `Foto de ${d.patrono.nome}`;
    img.onerror = () => {
      img.alt = "Foto do patrono (adicione depois em images/patrono-ariano.jpg)";
    };
  }
}

async function loadBlogPosts() {
  // 1) tenta carregar posts do arquivo do CMS
  try {
    const res = await fetch("posts/posts.json", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.posts)) return json.posts;
    }
  } catch (e) {
    // ignora e usa fallback
  }

  // 2) fallback: usa posts do data.js (caso exista)
  const d = window.OLEITOR_DATA;
  return Array.isArray(d?.blog) ? d.blog : [];
}

async function renderBlog(){
  const list = $("#blogList");
  const view = $("#blogView");
  if(!list) return;
  if(view) view.style.display = "none";

  const posts = await loadBlogPosts();

  if(posts.length === 0){
    list.innerHTML = `<div class="card"><p class="muted">Nenhum post publicado ainda.</p></div>`;
    return;
  }

  list.innerHTML = posts.map((p,i)=>`
    <a class="item" href="post.html?id=${i}" style="text-decoration:none">
      <div class="left">
        <strong>${escapeHtml(p.titulo)}</strong>
        <span class="muted">${fmtBRDate(p.data)} · ${escapeHtml(p.resumo)}</span>
      </div>
      <div class="right">
        <span class="pill primary">Ler</span>
      </div>
    </a>
  `).join("");

  // Guarda os posts carregados em memória para o post.html usar (opcional)
  window.__BLOG_POSTS__ = posts;
}


function renderExpediente(){
  const d = window.OLEITOR_DATA;
  const members = $("#membrosBox");
  const meta = $("#expedienteMeta");
  if(!members || !meta) return;

  members.innerHTML = `
    <div class="grid">
      ${d.expediente.membros.map(m=>`
        <div class="card">
          <img class="photo" src="${m.foto}" alt="Foto de ${escapeHtml(m.nome)}"
               onerror="this.alt='Foto (adicione depois em ${escapeHtml(m.foto)})'">
          <h3 style="margin-top:12px">${escapeHtml(m.nome)}</h3>
          <p class="muted">${escapeHtml(m.funcao)}</p>
        </div>
      `).join("")}
    </div>
  `;

  meta.innerHTML = `
    <div class="card">
      <h2>Informações</h2>
      <div class="kv">
        <div><b>Periodicidade</b><span>${escapeHtml(d.expediente.periodicidade)}</span></div>
        <div><b>Idioma</b><span>${escapeHtml(d.expediente.idioma)}</span></div>
        <div><b>Editor Chefe</b><span>${escapeHtml(d.expediente.editorChefe)}</span></div>
        <div><b>Diagramação</b><span>${escapeHtml(d.expediente.diagramacao)}</span></div>
      </div>
    </div>
  `;
}
function renderContato(){
  const d = window.OLEITOR_DATA;
  $("#contatoEmail") && ($("#contatoEmail").textContent = d.contato.email);
  $("#contatoEmailLink") && ($("#contatoEmailLink").href = `mailto:${d.contato.email}`);
  $("#contatoInstagram") && ($("#contatoInstagram").textContent = d.contato.instagram);
  $("#contatoX") && ($("#contatoX").textContent = d.contato.x);
}

document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();
  setHeader();
  renderEdicaoAtual();
  renderArquivo();
  renderPatrono();
  renderBlog();
  renderExpediente();
  renderContato();
});

function getArquivoItems(){
  const d = window.OLEITOR_DATA || {};
  // tente achar a lista em lugares comuns
  return Array.isArray(d.arquivo) ? d.arquivo
       : Array.isArray(d.edicoes) ? d.edicoes
       : Array.isArray(d.archive) ? d.archive
       : [];
}

/**
 * Extrai ano (YYYY) e mês (1-12) do item, tentando campos comuns.
 * Ajuste aqui se seu data.js tiver nomes diferentes.
 */
function extractYearMonth(item){
  // 1) campos diretos
  const ano = item.ano ?? item.year ?? item.ano_publicacao ?? null;
  const mes = item.mes ?? item.month ?? item.mes_num ?? null;

  // se ano é numérico e mês é numérico
  if (ano && mes && Number.isFinite(+ano) && Number.isFinite(+mes)){
    return { y: +ano, m: +mes };
  }

  // 2) campo tipo "2025-03" ou "2025-03-01"
  const s = String(item.data ?? item.ym ?? item.ref ?? item.id ?? "");
  const m1 = s.match(/^(\d{4})-(\d{2})/);
  if (m1){
    return { y: +m1[1], m: +m1[2] };
  }

  // 3) campo mês por nome (ex: "Março/2025")
  const s2 = String(item.titulo ?? item.label ?? item.nome ?? "");
  const m2 = s2.match(/(\d{4})/);
  const y2 = m2 ? +m2[1] : null;

  const monthMap = {
    "janeiro":1,"fevereiro":2,"março":3,"marco":3,"abril":4,"maio":5,"junho":6,
    "julho":7,"agosto":8,"setembro":9,"outubro":10,"novembro":11,"dezembro":12
  };
  const lower = s2.toLowerCase();
  const found = Object.keys(monthMap).find(k => lower.includes(k));
  if (y2 && found){
    return { y: y2, m: monthMap[found] };
  }

  return { y: null, m: null };
}

function monthLabel(m){
  const nomes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  return nomes[m-1] || "";
}

function renderArquivoFiltered(ySel, mSel){
  const box = document.getElementById("arquivoBox");
  if(!box) return;

  const items = getArquivoItems()
    .map(it => {
      const {y,m} = extractYearMonth(it);
      return { ...it, __y:y, __m:m };
    })
    .filter(it => it.__y && it.__m);

  const filtered = items.filter(it => {
    const okY = (ySel === "all") ? true : (String(it.__y) === String(ySel));
    const okM = (mSel === "all") ? true : (String(it.__m) === String(mSel));
    return okY && okM;
  });

  // Título (sem "(2025)")
  const title = `<div class="card">
      <h1>Arquivo de Edições</h1>
      <p class="muted">Clique em <b>Baixar</b> para abrir o diálogo do navegador (Salvar/Download).</p>
    </div>`;

  if(filtered.length === 0){
    box.innerHTML = title + `<div class="card" style="margin-top:14px"><p class="muted">Nenhuma edição encontrada para o filtro selecionado.</p></div>`;
    return;
  }

  // Ordena: mais recente primeiro
  filtered.sort((a,b) => (b.__y*100+b.__m) - (a.__y*100+a.__m));

  // Render
  const list = filtered.map(it => {
    const label = `${monthLabel(it.__m)}/${it.__y}`;
    const nome = it.nome ?? it.titulo ?? it.arquivo ?? it.file ?? "PDF";
    const url  = it.url ?? it.pdf ?? it.link ?? it.href ?? "#";

    return `
      <div class="item">
        <div class="left">
          <strong>${label}</strong>
          <span class="muted">${nome}</span>
        </div>
        <div class="right">
          <a class="pill" href="${url}" target="_blank" rel="noopener noreferrer">Visualizar</a>
          <a class="pill primary" href="${url}" download>Baixar</a>
        </div>
      </div>
    `;
  }).join("");

  box.innerHTML = title + `<div class="card" style="margin-top:14px"><div class="list">${list}</div></div>`;
}

function initArquivoFiltro(){
  const fAno = document.getElementById("fAno");
  const fMes = document.getElementById("fMes");
  const btnLimpar = document.getElementById("btnLimpar");
  const box = document.getElementById("arquivoBox");
  if(!fAno || !fMes || !box) return;

  const items = getArquivoItems()
    .map(it => extractYearMonth(it))
    .filter(x => x.y && x.m);

  const years = Array.from(new Set(items.map(x => x.y))).sort((a,b)=>b-a);
  const months = Array.from(new Set(items.map(x => x.m))).sort((a,b)=>b-a);

  // popula selects
  fAno.innerHTML = `<option value="all">Todos</option>` + years.map(y => `<option value="${y}">${y}</option>`).join("");
  fMes.innerHTML = `<option value="all">Todos</option>` + months.map(m => `<option value="${m}">${monthLabel(m)}</option>`).join("");

  function refresh(){
    renderArquivoFiltered(fAno.value, fMes.value);
  }

  fAno.addEventListener("change", refresh);
  fMes.addEventListener("change", refresh);

  btnLimpar?.addEventListener("click", ()=>{
    fAno.value = "all";
    fMes.value = "all";
    refresh();
  });

  refresh(); // primeira renderização
}

// chama apenas na página arquivo
document.addEventListener("DOMContentLoaded", ()=>{
  if (document.getElementById("arquivoBox") && document.getElementById("fAno") && document.getElementById("fMes")){
    initArquivoFiltro();
  }
});

