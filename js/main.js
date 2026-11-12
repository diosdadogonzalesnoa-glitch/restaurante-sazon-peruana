/* Sazón Peruana — interacciones */
(function () {
  'use strict';

  // El número de WhatsApp se lee de js/config.js (vacío = modo demostración).
  var WHATSAPP = String((window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || '').replace(/\D/g, '');
  var DEMO = WHATSAPP === '';

  document.documentElement.classList.add('js');

  /* ---------- Navegación sólida al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var burger = document.querySelector('.nav__burger');
  var mobileMenu = document.getElementById('mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.classList.add('is-solid'); else onScroll();
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hidden) setMenu(false);
  });

  /* ---------- Enlaces de WhatsApp ---------- */
  var waBase = 'https://wa.me/' + WHATSAPP;
  document.querySelectorAll('.js-whatsapp').forEach(function (a) {
    if (DEMO) { a.href = '#reservas'; return; }
    a.href = waBase + '?text=' + encodeURIComponent('Hola Sazón Peruana, quisiera hacer una consulta.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Revelado sutil de títulos ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Formulario de reservas → WhatsApp ---------- */
  var form = document.getElementById('booking-form');
  var msg = form.querySelector('.form__msg');
  var dateInput = form.querySelector('input[type="date"]');
  var today = new Date();
  var pad = function (n) { return String(n).padStart(2, '0'); };
  dateInput.min = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var valid = el.value.trim() !== '';
      el.closest('.field').classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      msg.textContent = 'Completa los campos marcados para continuar.';
      return;
    }
    var d = new FormData(form);
    var fecha = d.get('fecha').split('-').reverse().join('/');
    var texto =
      'Hola Sazón Peruana, quisiera reservar una mesa.\n' +
      '• Nombre: ' + d.get('nombre') + '\n' +
      '• Personas: ' + d.get('personas') + '\n' +
      '• Fecha: ' + fecha + '\n' +
      '• Hora: ' + d.get('hora') +
      (d.get('comentario') ? '\n• Comentarios: ' + d.get('comentario') : '');
    if (DEMO) {
      msg.textContent = '¡Gracias, ' + d.get('nombre') + '! Este es un sitio de demostración: en la versión real, tu reserva se enviaría por WhatsApp.';
      form.reset();
      return;
    }
    msg.textContent = 'Abriendo WhatsApp para confirmar tu reserva…';
    window.open(waBase + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });

  form.addEventListener('input', function (e) {
    var f = e.target.closest('.field');
    if (f && e.target.value.trim() !== '') f.classList.remove('is-invalid');
  });

  /* ---------- Año del footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* Videos de fondo: fundido al cargar; el Video 2 se descarga solo al llegar a su sección
   y se pausa cuando sale de pantalla. Respeta "reducir movimiento". */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var videos = document.querySelectorAll(".bg-video");
  function ready(v) {
    var show = function () { v.classList.add("is-ready"); };
    if (v.readyState >= 3) show(); else v.addEventListener("canplay", show, { once: true });
  }
  function play(v) {
    if (reduce) return;
    var p = v.play && v.play();
    if (p && p.catch) p.catch(function () { v.classList.add("is-ready"); });
  }
  function hydrate(v) {
    if (!v.hasAttribute("data-lazy")) return;
    v.removeAttribute("data-lazy");
    v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.getAttribute("data-src"); s.removeAttribute("data-src"); });
    v.preload = "auto";
    v.load();
  }
  videos.forEach(function (v) {
    ready(v);
    if (reduce) { v.removeAttribute("autoplay"); v.pause(); }
    if (!v.hasAttribute("data-lazy")) play(v);
  });
  if (!("IntersectionObserver" in window)) {
    videos.forEach(function (v) { hydrate(v); ready(v); play(v); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (v.hasAttribute("data-lazy")) { hydrate(v); ready(v); } play(v); }
      else if (!v.paused) { v.pause(); }
    });
  }, { rootMargin: "300px 0px" });
  videos.forEach(function (v) { io.observe(v); });
})();
