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

