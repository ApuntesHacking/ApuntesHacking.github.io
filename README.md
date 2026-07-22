# Apuntes Hacking — plantilla Hugo

Plantilla de tu web en Hugo, pensada para escribirse desde cero: solo hay dos
entradas de ejemplo (módulo 1, temas 1.1 y 1.2) que demuestran el patrón a
seguir. El resto del contenido lo vas añadiendo tú.

## Por qué esta plantilla es distinta de la versión Jekyll

La diferencia principal no es solo el motor — es que **el índice de la
portada ya no se mantiene a mano**. En la versión Jekyll, cada vez que
añadías una entrada tenías que ir también a `index.md` y añadir su enlace en
la sección de su módulo. Aquí no: la portada se genera sola a partir del
contenido que exista en `content/paginas/`, agrupado y ordenado
automáticamente por módulo. Añades un `.md`, aparece en su sitio. Eso es lo
que la hace más sostenible para quien mantenga esto dentro de varios años.

También el prev/next entre entradas es automático (se calcula por el campo
`weight`), y el color/nombre del módulo se define **una sola vez** en
`data/modulos.yaml`, no se repite en cada página.

## Estructura

```
hugo.toml              # configuración del sitio
data/modulos.yaml       # los 37 módulos: número, nombre, color — única fuente de verdad
layouts/
  _default/baseof.html   # <head> y <body> comunes a toda la web
  partials/head.html      # meta tags, CSS, fuentes
  partials/buscar-modulo.html  # busca en modulos.yaml el módulo de una entrada
  index.html               # portada: hero + índice generado automáticamente
  paginas/single.html       # plantilla de cada entrada (nav, cabecera, sidebar, paginación)
archetypes/paginas.md    # plantilla que rellena "hugo new" al crear una entrada
content/
  _index.md                # front matter de la portada (hero, subtítulo...)
  paginas/1-mentalidad-entorno/
    1-1-fundamentos-opsec.md   # entrada de ejemplo completa
    1-2-threat-modeling.md     # segunda entrada, para ver cómo enlazan entre sí
static/
  css/                    # tus mismos base_style.css y modulo.css, sin tocar
  js/modulo.js             # botón volver arriba, selector de temas, copiar código
.github/workflows/hugo.yml   # compila y publica en GitHub Pages en cada push
```

## Cómo añadir una entrada nueva

La forma más rápida:

```bash
hugo new content/paginas/2-hardening-operador/2-1-dispositivo-operador.md
```

Esto crea el archivo relleno con la plantilla de `archetypes/paginas.md`.
Ábrelo y rellena:

```yaml
---
title: "Título SEO de la página"
description: "Descripción para buscadores (150-160 caracteres)"

modulo_num: 2              # debe existir en data/modulos.yaml
tema_num: "2.1"
tema_titulo: "El dispositivo del operador"
tema_desc: "Párrafo de introducción bajo el título."

weight: 210                 # orden de lectura global — ver convención abajo

accent: "#FF6B4D"           # mismo color que el resto de entradas del módulo 2
accent_dim: "rgba(255, 107, 77, 0.08)"
accent_glow: "rgba(255, 107, 77, 0.25)"

subtemas:
  - anchor: "tema-2.1.1"
    label: "2.1.1 VMs vs hardware dedicado"
  - anchor: "tema-2.1.1-detalle"    # "sub: true" = solo aparece en la barra
    label: "Un detalle más fino"     # lateral de la página, no en el índice
    sub: true
  - anchor: "tema-2.1.2"
    label: "2.1.2 Tails OS"
---
```

Y debajo, tu contenido: puedes escribir Markdown normal o pegar tus bloques
HTML con clases (`code-block`, `callout`, `table-wrapper`...) tal cual los
usabas antes — Hugo los deja pasar sin tocarlos.

### Convención para `weight`

Usa el número de módulo × 100 + un consecutivo: módulo 1 → 100, 101, 102...;
módulo 2 → 200, 201...; módulo 3 → 300... Dejar huecos (210, 220, 230) te
permite insertar una entrada nueva en medio sin renumerar las demás.

### Colores por módulo

Los mismos 37 colores que ya tenías, en `data/modulos.yaml`. Cuando escribas
una entrada, copia el color de ese módulo en `accent`/`accent_dim`/
`accent_glow` — no hace falta inventarlo, está ahí para consultarlo.

## Migrar tus entradas antiguas (HTML o las de la versión Jekyll)

Esta plantilla no las convierte automáticamente. Si más adelante quieres
traer contenido de tu web HTML original o de la versión Jekyll, el patrón es:
extraer el `<h1>`, la descripción y las secciones `tema-section` de cada
archivo antiguo, y montar el front matter de arriba con esos datos. Si
llegas a ese punto y quieres que te escriba un script de conversión
(como hice para la versión Jekyll), dímelo.

## Probar en local

```bash
hugo server -D
```

Abre `http://localhost:1313`.

## Publicar en GitHub Pages

A diferencia de Jekyll, GitHub Pages no compila Hugo de forma nativa —
necesita el workflow de GitHub Actions que ya está incluido
(`.github/workflows/hugo.yml`). Pasos:

1. Sube este repo a GitHub.
2. En **Settings → Pages → Build and deployment**, elige **GitHub Actions**
   (no "Deploy from a branch").
3. Cada push a `main` compila y publica solo. Tarda 1-2 minutos.

## Notas

- Las advertencias `found no layout file for kind "taxonomy"/"section"` al
  compilar son inofensivas — vienen de páginas de listado que no usamos
  (categorías, etiquetas, el índice automático de `/paginas/`). No afectan
  al sitio.
- `assets/js/modulo.js` no existía entre tus archivos originales (solo
  estaba referenciado desde el HTML antiguo) — lo escribí yo con el botón
  de volver arriba, el selector de temas y el botón de copiar código.
