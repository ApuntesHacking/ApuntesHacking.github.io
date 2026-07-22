---
title: "Fundamentos de OPSEC antes de tocar nada"
description: "Qué es OPSEC, las 5 fases clásicas y por qué es la base de todo lo demás en este sitio."

modulo_num: 1
tema_num: "1.1"
tema_titulo: "Fundamentos de OPSEC antes de tocar nada"
tema_desc: "Antes de instalar herramientas o abrir una terminal, hay una pregunta que responder: ¿qué estás protegiendo y de quién? OPSEC es el marco mental que responde a eso."

weight: 100

accent: "#FF4D6A"
accent_dim: "rgba(255, 77, 106, 0.08)"
accent_glow: "rgba(255, 77, 106, 0.25)"

subtemas:
  - anchor: "tema-1.1.1"
    label: "1.1.1 ¿Qué es OPSEC?"
  - anchor: "tema-1.1.1-origen"
    label: "Origen militar del concepto"
    sub: true
  - anchor: "tema-1.1.2"
    label: "1.1.2 Las 5 fases clásicas"
---

<section class="tema-section" id="tema-1.1.1">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.1</span> ¿Qué es OPSEC?
</h2>
<div class="tema-content">

<h3 id="tema-1.1.1-origen"><strong style="color: #FF4D6A">Origen militar del concepto</strong></h3>

<p>OPSEC (<strong>Operations Security</strong>) nace en el ejército de EE.UU. durante la guerra de Vietnam, cuando se descubrió que el enemigo no necesitaba espías: bastaba con observar patrones aparentemente inocentes (horarios de vuelo, rutinas de radio) para anticipar operaciones. La lección clave: <strong>la información sensible no siempre parece sensible</strong>.</p>

<div class="callout callout-tip">
<span class="callout-icon">💡</span>
<div class="callout-body">
<strong>Idea central:</strong> OPSEC no protege secretos concretos, protege <em>patrones</em>. Un solo dato suelto rara vez importa; la combinación de varios sí.
</div>
</div>

<p>Aplicado a hacking y a este sitio, esto se traduce en preguntas muy concretas antes de tocar cualquier herramienta:</p>

<ul class="concept-list">
<li><strong>¿Qué estoy protegiendo?</strong> — identidad, ubicación, el propio hallazgo, el cliente...</li>
<li><strong>¿De quién?</strong> — no es lo mismo protegerse de un script kiddie que de un adversario con recursos legales.</li>
<li><strong>¿Qué pasa si falla?</strong> — el "peor caso" cambia por completo cómo te preparas.</li>
</ul>

</div>
</section>

<section class="tema-section" id="tema-1.1.2">
<h2 class="tema-section-title">
<span class="tema-section-code">1.1.2</span> Las 5 fases clásicas
</h2>
<div class="tema-content">

<p>El proceso formal de OPSEC se resume en cinco pasos, pensados para repetirse antes de cada operación, no solo una vez:</p>

<div class="table-wrapper">
<table>
<thead>
<tr><th>Fase</th><th>Pregunta que responde</th></tr>
</thead>
<tbody>
<tr><td>1. Identificar información crítica</td><td>¿Qué dato, si se filtra, me compromete?</td></tr>
<tr><td>2. Analizar amenazas</td><td>¿Quién querría ese dato y por qué?</td></tr>
<tr><td>3. Analizar vulnerabilidades</td><td>¿Por dónde se podría filtrar?</td></tr>
<tr><td>4. Evaluar el riesgo</td><td>¿Qué probabilidad e impacto tiene cada fuga?</td></tr>
<tr><td>5. Aplicar contramedidas</td><td>¿Qué cambio concreto reduce ese riesgo?</td></tr>
</tbody>
</table>
</div>

<div class="code-block">
<div class="code-header">
<span class="code-lang">ejemplo — checklist mental rápido</span>
<button class="copy-btn">📋 Copiar</button>
</div>
<pre><code><span class="code-comment"># Antes de cualquier operación, pregúntate:</span>
<span class="code-str">1.</span> ¿Qué es lo peor que puede pasar si esto se sabe?
<span class="code-str">2.</span> ¿Quién se beneficiaría de saberlo?
<span class="code-str">3.</span> ¿Ya he dejado rastro de esto en algún sitio?
<span class="code-str">4.</span> ¿Qué cambia si asumo que ya me están observando?</code></pre>
</div>

<div class="callout callout-warning">
<span class="callout-icon">⚠️</span>
<div class="callout-body">
<strong>Error habitual:</strong> tratar OPSEC como una lista que se hace una vez al principio. Las fases se repiten porque el contexto (herramientas, objetivo, exposición) cambia en cada operación.
</div>
</div>

</div>
</section>
