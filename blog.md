---
layout: page
title: "Blog"
permalink: /blog/
---

{% for post in site.posts %}
<div class="card">
  <div class="muted">{{ post.date | date: "%d/%m/%Y" }} · {{ post.author | default: "Equipe O Leitor" }}</div>
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <p>{{ post.excerpt | strip_html | truncate: 220 }}</p>
</div>
{% endfor %}
