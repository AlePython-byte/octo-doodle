/* ═══════════════════════════════════════════════════════
   MAIN.JS — Trío Magia Blanca de Colombia
   Vanilla JS · Sin dependencias externas
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   Referencias al DOM
───────────────────────────────────── */
const html             = document.documentElement;
const body             = document.body;
const navbar           = document.getElementById('navbar');
const hamburger        = document.getElementById('hamburger');
const navLinks         = document.getElementById('nav-links');
const themeToggle      = document.getElementById('theme-toggle');
const langToggle       = document.getElementById('lang-toggle');
const heroBg           = document.getElementById('hero-bg');
const heroContent      = document.getElementById('hero-content');
const scrollIndicator  = document.getElementById('scroll-indicator');
const particlesCont        = document.getElementById('particles');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ═══════════════════════════════════════════════════════
   1. MODO OSCURO / CLARO
   Persiste en localStorage
═══════════════════════════════════════════════════════ */

(function iniciarTema() {
  const guardado = localStorage.getItem('tmb-theme') || 'dark';
  html.setAttribute('data-theme', guardado);
})();

themeToggle.addEventListener('click', () => {
  const actual  = html.getAttribute('data-theme');
  const nuevo   = actual === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', nuevo);
  localStorage.setItem('tmb-theme', nuevo);
});


/* ═══════════════════════════════════════════════════════
   2. TOGGLE DE IDIOMA ES / EN (solo visual)
   Alterna data-lang en body para mostrar/ocultar spans
═══════════════════════════════════════════════════════ */

let idioma = localStorage.getItem('tmb-lang') || 'es';
body.setAttribute('data-lang', idioma);
refrescarBotonesIdioma();

langToggle.addEventListener('click', () => {
  idioma = idioma === 'es' ? 'en' : 'es';
  body.setAttribute('data-lang', idioma);
  localStorage.setItem('tmb-lang', idioma);
  refrescarBotonesIdioma();
});

function refrescarBotonesIdioma() {
  langToggle.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === idioma);
  });
}


/* ═══════════════════════════════════════════════════════
   3. HAMBURGER MENU (mobile)
═══════════════════════════════════════════════════════ */

hamburger.addEventListener('click', () => {
  const abierto = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', abierto);
  hamburger.setAttribute('aria-expanded', String(abierto));
  hamburger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

/* Cerrar al hacer click en cualquier link del menú */
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', cerrarMenu);
});

/* Cerrar al hacer click fuera del navbar */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) cerrarMenu();
});

function cerrarMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menú');
}


/* ═══════════════════════════════════════════════════════
   4. NAVBAR — GLASSMORPHISM AL HACER SCROLL
═══════════════════════════════════════════════════════ */

function actualizarNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

/* Actualiza el link activo según la sección visible */
function actualizarLinkActivo() {
  const umbral = window.scrollY + 96;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = navLinks.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const dentro = umbral >= sec.offsetTop && umbral < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', dentro);
  });
}


/* ═══════════════════════════════════════════════════════
   5. PARALLAX DEL FONDO DEL HERO
   El fondo se mueve al 35% de la velocidad de scroll
═══════════════════════════════════════════════════════ */

function aplicarParallax() {
  if (!heroBg || prefersReducedMotion) return;
  heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
}


/* ═══════════════════════════════════════════════════════
   6. FADE-OUT DEL CONTENIDO DEL HERO AL BAJAR
   El contenido desaparece progresivamente al scrollear
═══════════════════════════════════════════════════════ */

function aplicarFadeHero() {
  const hero    = document.getElementById('inicio');
  if (!hero || !heroContent) return;

  const progreso  = Math.min(window.scrollY / (hero.offsetHeight * 0.58), 1);
  const opacidad  = 1 - progreso;
  const desplaz   = progreso * 28;

  heroContent.style.opacity = opacidad;
  if (!prefersReducedMotion) heroContent.style.transform = `translateY(${desplaz}px)`;

  if (scrollIndicator) {
    scrollIndicator.style.opacity = 1 - Math.min(window.scrollY / 220, 1);
  }
}


/* ═══════════════════════════════════════════════════════
   7. LISTENER DE SCROLL — optimizado con rAF
═══════════════════════════════════════════════════════ */

let rafPendiente     = false;
let actualizarBotonTop = function () {};

window.addEventListener('scroll', () => {
  if (rafPendiente) return;
  rafPendiente = true;
  requestAnimationFrame(() => {
    actualizarNavbar();
    aplicarParallax();
    aplicarFadeHero();
    actualizarLinkActivo();
    actualizarBotonTop();
    rafPendiente = false;
  });
}, { passive: true });

/* Estado inicial */
actualizarNavbar();
aplicarParallax();


/* ═══════════════════════════════════════════════════════
   8. PARTÍCULAS FLOTANTES (notas musicales)
   Genera elementos DOM con posiciones y tiempos aleatorios
═══════════════════════════════════════════════════════ */

const SIMBOLOS   = ['♪', '♫', '♩', '♬'];
const N_PART     = prefersReducedMotion ? 0 : (window.innerWidth < 768 ? 8 : 20);

function generarParticulas() {
  if (!particlesCont) return;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < N_PART; i++) {
    const el       = document.createElement('span');
    const simbolo  = SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];
    const tamano   = 10 + Math.random() * 18;          /* 10 – 28px */
    const opacidad = 0.04 + Math.random() * 0.10;      /* 0.04 – 0.14 */
    const left     = Math.random() * 100;               /* 0 – 100vw */
    const top      = 10 + Math.random() * 75;           /* 10 – 85vh */
    const duracion = 20 + Math.random() * 22;           /* 20 – 42s */
    const retraso  = -(Math.random() * duracion);       /* desfase negativo */

    el.className   = 'particle';
    el.textContent = simbolo;
    el.style.cssText = `
      font-size: ${tamano}px;
      left: ${left}%;
      top: ${top}vh;
      --p-opacity: ${opacidad};
      animation-duration: ${duracion}s;
      animation-delay: ${retraso}s;
    `;
    frag.appendChild(el);
  }

  particlesCont.appendChild(frag);
}

generarParticulas();


/* ═══════════════════════════════════════════════════════
   9. ANIMACIÓN DE ENTRADA ESCALONADA (staggered)
   Se activa agregando .loaded al body tras dos frames
   para garantizar que el CSS haya pintado el estado inicial
═══════════════════════════════════════════════════════ */

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    body.classList.add('loaded');
  });
});


/* ═══════════════════════════════════════════════════════
   10. SMOOTH SCROLL para links de ancla
   El scroll nativo de CSS ya cubre esto, pero esto
   asegura compatibilidad con navegadores más viejos
═══════════════════════════════════════════════════════ */

document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', e => {
    const target = document.querySelector(enlace.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ═══════════════════════════════════════════════════════
   11. INTERSECTION OBSERVER — Animaciones .fade-in-up
   Detecta cuando cada elemento entra al viewport y agrega
   la clase .visible para disparar la transición CSS.
   Solo anima una vez (unobserve tras la primera entrada).
═══════════════════════════════════════════════════════ */

const observadorScroll = new IntersectionObserver(
  (entradas) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visible');
      observadorScroll.unobserve(entrada.target);
    });
  },
  {
    threshold: 0.1,                  /* Disparar con el 10% visible */
    rootMargin: '0px 0px -40px 0px' /* Margen negativo inferior: evita disparar demasiado pronto */
  }
);

document.querySelectorAll('.fade-in-up').forEach(el => {
  observadorScroll.observe(el);
});


/* ═══════════════════════════════════════════════════════
   12. COUNT-UP — Estadísticas animadas (sección Trayectoria)
   Anima cada .stat-number desde 0 hasta data-target
   con easing ease-out cúbico cuando el .stats-bar entra
   al viewport. Respeta prefers-reduced-motion.
═══════════════════════════════════════════════════════ */

function animarContador(el) {
  const objetivo = parseInt(el.dataset.target, 10);
  const sufijo   = el.dataset.suffix || '';

  /* Si el usuario prefiere sin animaciones, mostrar el valor final directo */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = objetivo + sufijo;
    return;
  }

  const duracion = 1800; /* ms */
  let inicio     = null;

  function paso(ts) {
    if (inicio === null) inicio = ts;
    const progreso = Math.min((ts - inicio) / duracion, 1);
    /* Easing ease-out cúbico: f(t) = 1 - (1 - t)³ */
    const eased  = 1 - Math.pow(1 - progreso, 3);
    el.textContent = Math.round(eased * objetivo) + sufijo;
    if (progreso < 1) requestAnimationFrame(paso);
  }

  requestAnimationFrame(paso);
}

/* Observador específico para la stats-bar (threshold mayor = esperar a que
   la barra sea bien visible antes de arrancar el conteo) */
const observadorStats = new IntersectionObserver(
  (entradas) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      entrada.target.querySelectorAll('.stat-number').forEach(animarContador);
      observadorStats.unobserve(entrada.target);
    });
  },
  { threshold: 0.45 }
);

const statsBar = document.querySelector('.stats-bar');
if (statsBar) observadorStats.observe(statsBar);


/* ═══════════════════════════════════════════════════════
   13. CARRUSEL DE DISCOGRAFÍA
   Navegación prev/next con botones + swipe táctil.
   CSS scroll-snap se encarga de la alineación precisa.
═══════════════════════════════════════════════════════ */
(function iniciarCarrusel() {
  const track   = document.getElementById('albums-track');
  const btnPrev = document.getElementById('disco-prev');
  const btnNext = document.getElementById('disco-next');
  if (!track || !btnPrev || !btnNext) return;

  /* Anchura de un paso (1 ítem + gap) */
  function paso() {
    const item = track.querySelector('.album-item');
    if (!item) return 280;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    return item.offsetWidth + gap;
  }

  /* Desplazar N pasos: positivo = adelante, negativo = atrás */
  function navegar(pasos) {
    track.scrollBy({ left: pasos * paso(), behavior: 'smooth' });
  }

  btnPrev.addEventListener('click', () => navegar(-1));
  btnNext.addEventListener('click', () => navegar(1));

  /* Habilitar / deshabilitar botones según la posición del track */
  function actualizarBotones() {
    const { scrollLeft, scrollWidth, offsetWidth } = track;
    const alInicio = scrollLeft <= 1;
    const alFinal  = scrollLeft + offsetWidth >= scrollWidth - 1;

    btnPrev.disabled = alInicio;
    btnNext.disabled = alFinal;
    btnPrev.setAttribute('aria-disabled', String(alInicio));
    btnNext.setAttribute('aria-disabled', String(alFinal));
  }

  track.addEventListener('scroll', actualizarBotones, { passive: true });
  window.addEventListener('resize', actualizarBotones, { passive: true });
  actualizarBotones();

  /* ── Swipe táctil ── */
  let xInicio     = 0;
  let arrastrando = false;

  track.addEventListener('touchstart', e => {
    xInicio     = e.touches[0].clientX;
    arrastrando = true;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (!arrastrando) return;
    /* Mínimo 45 px de delta para considerar el gesto intencional */
    const delta = xInicio - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 45) navegar(delta > 0 ? 1 : -1);
    arrastrando = false;
  }, { passive: true });
})();


/* ═══════════════════════════════════════════════════════
   14. GALERÍA DE VIDEOS
   Selector interactivo con lazy loading del iframe.
   El primer video NO carga el iframe automáticamente;
   requiere click del usuario en el preview o miniatura.
   Para activar un video: data-video-id="ID_REAL_DE_YOUTUBE"
═══════════════════════════════════════════════════════ */
(function iniciarVideos() {
  const thumbBtns    = document.querySelectorAll('.video-thumb-btn');
  const iframe       = document.getElementById('video-iframe');
  const preview      = document.getElementById('video-preview');
  const previewBg    = document.getElementById('preview-bg');
  const playBtn      = document.getElementById('video-play-btn');
  const titleEl      = document.getElementById('video-featured-title');
  const counterEl    = document.getElementById('video-counter');
  const frameWrapper = document.getElementById('video-frame-wrapper');

  if (!iframe || !thumbBtns.length) return;

  const TOTAL = thumbBtns.length; /* 22 */
  let indiceActivo = 0;
  let iframeActivo = false;

  function embedUrl(id) {
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white&autoplay=1`;
  }

  function thumbUrl(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }

  /* Sincroniza aria-pressed en todos los botones */
  function actualizarMiniaturas(idx) {
    thumbBtns.forEach((btn, i) => {
      btn.setAttribute('aria-pressed', String(i === idx));
    });
  }

  /* Actualiza contador "01 / 22" y título debajo del player */
  function actualizarInfo(btn, idx) {
    const titulo = btn.dataset.title || '';
    titleEl.textContent = titulo;
    counterEl.innerHTML =
      `${String(idx + 1).padStart(2, '0')}&thinsp;/&thinsp;${String(TOTAL).padStart(2, '0')}`;
    iframe.setAttribute('title',
      `Video musical: ${titulo} — Trío Magia Blanca de Colombia`);
    if (playBtn) playBtn.setAttribute('aria-label', `Reproducir: ${titulo}`);
    if (preview) preview.setAttribute('aria-label', `Vista previa: ${titulo}`);
  }

  /* Inyecta el thumbnail de YouTube en el fondo del preview */
  function actualizarPreviewBg(btn) {
    const id = btn.dataset.videoId || '';
    /* Solo aplicar si el ID es real (no el placeholder AQUI_EL_ID_YOUTUBE_XX) */
    const esReal = id && !id.startsWith('AQUI');
    if (previewBg) {
      previewBg.style.backgroundImage = esReal ? `url('${thumbUrl(id)}')` : '';
    }
  }

  /* Limpia el iframe y vuelve a mostrar el preview */
  function resetearPlayer() {
    iframe.src = '';
    iframe.classList.remove('active');
    if (preview) preview.classList.remove('hidden');
    iframeActivo = false;
  }

  /* Fade out → swap de contenido → fade in al cambiar de video */
  function cambiarVideo(btn, idx) {
    frameWrapper.style.transition = 'opacity 0.22s ease';
    frameWrapper.style.opacity    = '0';

    setTimeout(() => {
      resetearPlayer();
      indiceActivo = idx;
      actualizarMiniaturas(idx);
      actualizarInfo(btn, idx);
      actualizarPreviewBg(btn);

      frameWrapper.style.transition = 'opacity 0.35s ease';
      frameWrapper.style.opacity    = '1';
    }, 240);
  }

  /* Inyecta el src del iframe con autoplay */
  function cargarIframe(btn) {
    const id = btn.dataset.videoId || '';
    if (!id || id.startsWith('AQUI')) return; /* ID todavía no configurado */
    iframe.src = embedUrl(id);
    iframe.classList.add('active');
    if (preview) preview.classList.add('hidden');
    iframeActivo = true;
  }

  /* Click en miniatura */
  thumbBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (i === indiceActivo) {
        /* Mismo video: solo carga el iframe si no estaba activo */
        if (!iframeActivo) cargarIframe(btn);
        return;
      }
      cambiarVideo(btn, i);
    });
  });

  /* Click en el área del preview (portada o botón ▶) */
  if (preview) {
    preview.addEventListener('click', () => {
      cargarIframe(thumbBtns[indiceActivo]);
    });
  }

  /* Estado inicial: video 01 seleccionado, iframe no cargado */
  actualizarMiniaturas(0);
  actualizarInfo(thumbBtns[0], 0);
  actualizarPreviewBg(thumbBtns[0]);

})();


/* ═══════════════════════════════════════════════════════
   15. FORMULARIO DE CONTACTO
   Submit con preventDefault() + mensaje de confirmación
   animado. No hay backend: solo muestra el feedback visual.
═══════════════════════════════════════════════════════ */
(function iniciarFormContacto() {
  const form    = document.getElementById('contact-form');
  const confirm = document.getElementById('form-confirm');
  if (!form || !confirm) return;

  /* Crear spans de error bajo cada campo requerido */
  form.querySelectorAll('[required]').forEach(input => {
    const field = input.closest('.form-field');
    if (!field) return;
    const span = document.createElement('span');
    span.className = 'form-error-msg';
    span.setAttribute('aria-live', 'polite');
    field.appendChild(span);

    input.addEventListener('input', () => {
      field.classList.remove('has-error');
      span.textContent = '';
    });
  });

  function mostrarError(input, msg) {
    const field = input.closest('.form-field');
    if (!field) return;
    field.classList.add('has-error');
    const span = field.querySelector('.form-error-msg');
    if (span) span.textContent = msg;
  }

  function validar() {
    let valido = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        mostrarError(input, 'Este campo es obligatorio.');
        valido = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        mostrarError(input, 'Por favor ingresa un correo válido.');
        valido = false;
      }
    });
    return valido;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar()) return;

    form.style.transition = 'opacity 0.28s ease';
    form.style.opacity    = '0';

    setTimeout(() => {
      form.hidden = true;
      form.removeAttribute('style');
      confirm.removeAttribute('hidden');
      void confirm.offsetWidth;
      confirm.classList.add('visible');
    }, 300);
  });
})();


/* ═══════════════════════════════════════════════════════
   16. BOTÓN VOLVER ARRIBA
   Aparece cuando el scroll supera 400 px.
   actualizarBotonTop fue declarada en el scope del módulo
   para que el rAF loop pueda invocarla antes de que este
   IIFE se ejecute (ambos son síncronos en la misma carga).
═══════════════════════════════════════════════════════ */
(function iniciarBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  /* Sobreescribe el stub declarado junto al rAF listener */
  actualizarBotonTop = function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Estado inicial (por si la página cargó con scroll previo) */
  actualizarBotonTop();
})();
