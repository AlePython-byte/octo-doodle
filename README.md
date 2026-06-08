# Trío Magia Blanca de Colombia — Sitio Web Oficial

Sitio web estático del Trío Magia Blanca de Colombia, fundado el 22 de abril de 1992 en Túquerres, Nariño. Construido en HTML, CSS y JavaScript vanilla — sin frameworks ni dependencias externas.

---

## Estructura de archivos

```
trio-magia-blanca/
├── index.html          ← Página única con todas las secciones
├── css/
│   ├── themes.css      ← Variables CSS (colores, modo oscuro/claro) — NO modificar
│   └── main.css        ← Todos los estilos del sitio
├── js/
│   └── main.js         ← Lógica JS (tema, idioma, animaciones, formulario…)
├── assets/
│   ├── images/         ← Fotos del trío, álbumes, integrantes, og-cover
│   └── audio/          ← Muestras de audio (si aplica)
└── vercel.json         ← Configuración de despliegue en Vercel
```

---

## Cómo personalizar el sitio

### Agregar fotos reales

Reemplaza los archivos de `assets/images/` con fotos reales del trío:

| Archivo sugerido | Uso |
|---|---|
| `hero-bg.jpg` | Fondo principal del hero (≥ 1920 × 1080 px) |
| `og-cover.jpg` | Vista previa en redes sociales (1200 × 630 px) |
| `historia-foto.jpg` | Foto en la sección Historia |
| `integrante-1.jpg` | Foto del integrante 1 (cuadrada, ≥ 400 × 400 px) |
| `integrante-2.jpg` | Foto del integrante 2 |
| `integrante-3.jpg` | Foto del integrante 3 |
| `album-1.jpg` … `album-N.jpg` | Portadas de álbumes (cuadradas, ≥ 300 × 300 px) |

### Agregar IDs de YouTube a los videos

En `index.html`, busca los botones de la sección `#videos`. Cada uno tiene:

```html
<button class="video-thumb-btn" data-video-id="AQUI_EL_ID_YOUTUBE_01" data-title="Nombre del video">
```

Reemplaza `AQUI_EL_ID_YOUTUBE_01` por el ID real del video de YouTube.  
El ID es la parte que aparece después de `v=` en la URL: `youtube.com/watch?v=`**`dQw4w9WgXcQ`**.

### Agregar enlaces a redes sociales

En `index.html`, busca los comentarios:

```html
<!-- ENLACE REAL: cambiar href="#" por la URL real de Facebook -->
```

Reemplaza `href="#"` por la URL completa del perfil (Facebook, Instagram, YouTube, etc.).

---

## Despliegue en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), importa el repositorio.
3. Vercel detecta automáticamente que es un sitio estático — no requiere configuración adicional.
4. El archivo `vercel.json` ya incluye las reglas de reescritura y cabeceras de seguridad.

---

## Tecnologías

- HTML5 semántico
- CSS3 con Custom Properties (modo oscuro/claro)
- JavaScript ES6+ vanilla (sin jQuery ni frameworks)
- Fuentes: Playfair Display + Cormorant Garamond (Google Fonts)
- Videos: embeds de YouTube con lazy loading
