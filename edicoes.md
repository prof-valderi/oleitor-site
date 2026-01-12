---
layout: page
title: "Arquivo de Edições"
permalink: /edicoes/
---

# Arquivo de Edições

{% assign ordenadas = site.data.edicoes | sort: "data" | reverse %}
{% for e in ordenadas %}
<div class="card">
  <div class="muted">{{ e.data }}</div>
  <h3><a href="{{ '/edicao/' | append: e.slug | append: '/' | relative_url }}">{{ e.titulo }}</a></h3>
  {% if e.pdf_url %}<p><a href="{{ e.pdf_url }}">Abrir PDF</a></p>{% endif %}
</div>
{% endfor %}
