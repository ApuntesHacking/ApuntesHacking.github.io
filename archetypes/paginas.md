---
title: "Título SEO de la página"
description: "Descripción corta (150-160 caracteres) para buscadores."

# --- Identidad del módulo/tema ---
modulo_num: 1              # número del módulo (debe existir en data/modulos.yaml)
tema_num: "1.X"            # código del tema, ej. "1.3"
tema_titulo: "Título visible del tema"
tema_desc: "Párrafo de introducción que aparece bajo el título."

# --- Orden de lectura global (determina el orden en el índice Y el prev/next automático) ---
# Convención: 100 + módulo*100... por ejemplo módulo 1 -> 100-199, módulo 2 -> 200-299, etc.
weight: 100

# --- Color del módulo (mismo para todas las entradas de ese módulo) ---
accent: "#FF4D6A"
accent_dim: "rgba(255, 77, 106, 0.08)"
accent_glow: "rgba(255, 77, 106, 0.25)"

# --- Subtemas: alimenta el índice, el desplegable "saltar a tema" y la barra
#     lateral, todo desde esta única lista. Añade "sub: true" a un ítem para
#     que solo aparezca en la barra lateral (subsección más fina), no en el
#     índice ni en el desplegable. ---
subtemas:
  - anchor: "tema-1.X.1"
    label: "1.X.1 Primer subtema"
  - anchor: "tema-1.X.2"
    label: "1.X.2 Segundo subtema"
---

<section class="tema-section" id="tema-1.X.1">
<h2 class="tema-section-title">
<span class="tema-section-code">1.X.1</span> Primer subtema
</h2>
<div class="tema-content">

<p>Escribe aquí tu contenido. Puedes usar Markdown normal (negritas, enlaces,
listas) o HTML tal cual para los bloques que necesitan estilo especial, como
los de código:</p>

<div class="code-block">
<div class="code-header">
<span class="code-lang">bash</span>
<button class="copy-btn">📋 Copiar</button>
</div>
<pre><code><span class="code-comment"># Comentario de ejemplo</span>
<span class="code-cmd">comando</span> <span class="code-flag">--flag</span> <span class="code-path">/ruta/al/archivo</span></code></pre>
</div>

</div>
</section>
