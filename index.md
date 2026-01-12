---
layout: page
title: "Início"
---

## Campanha Escreva! — Participe.

A literatura é um campo vastíssimo de enriquecimento intelectual e social. O Leitor apresenta-se como colaborador nesta empresa que cada um precisa assumir para o bem de si mesmo: a leitura.  
**Ler para crescer.** :contentReference[oaicite:3]{index=3}

### Posts recentes
<div class="grid">
{% for post in site.posts limit: 6 %}
  <div class="card">
    <div class="muted">{{ post.date | date: "%d/%m/%Y" }} · {{ post.author | default: "Equipe O Leitor" }}</div>
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
  </div>
{% endfor %}
</div>
