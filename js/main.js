// - interacciones
(function () {
  'use strict';

  // - numero desde config.js, vacio = demo
  var WHATSAPP = String((window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || '').replace(/\D/g, '');
  var DEMO = WHATSAPP === '';

  document.documentElement.classList.add('js');

  // - nav al hacer scroll
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // - menu movil
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

  // - enlaces de whatsapp
  var waBase = 'https://wa.me/' + WHATSAPP;
  document.querySelectorAll('.js-whatsapp').forEach(function (a) {
    if (DEMO) { a.href = '#reservas'; return; }
    a.href = waBase + '?text=' + encodeURIComponent('¡Hola, Sazón Peruana! Quisiera hacerles una consulta.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // - aparicion de titulos
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

  // - reservas por whatsapp
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
    var nombre = d.get('nombre').trim();
    var personas = d.get('personas') === '10+' ? 'Más de 10 personas'
      : d.get('personas') + (d.get('personas') === '1' ? ' persona' : ' personas');
    // - fecha larga, ej. sábado 20 de diciembre de 2026
    var p = d.get('fecha').split('-');
    var fecha = new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).replace(',', '');
    fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    var comentario = d.get('comentario').trim();

    // - mensaje formal, el cliente solo pulsa enviar
    var texto =
      '¡Hola, Sazón Peruana! Quisiera solicitar una reserva con los siguientes datos:\n\n' +
      '*Nombre:* ' + nombre + '\n' +
      '*Personas:* ' + personas + '\n' +
      '*Fecha:* ' + fecha + '\n' +
      '*Hora:* ' + d.get('hora') + ' h' +
      (comentario ? '\n*Comentarios:* ' + comentario : '') +
      '\n\nQuedo a la espera de su confirmación. ¡Muchas gracias!';

    if (DEMO) {
      msg.textContent = '¡Gracias, ' + nombre + '! Este es un sitio de demostración: en la versión real, tu reserva se enviaría por WhatsApp.';
      form.reset();
      return;
    }
    var url = waBase + '?text=' + encodeURIComponent(texto);
    msg.textContent = 'Te llevamos a WhatsApp: solo pulsa «Enviar» para confirmar tu reserva.';
    var w = window.open(url, '_blank');
    if (w) w.opener = null; else window.location.href = url;
  });

  form.addEventListener('input', function (e) {
    var f = e.target.closest('.field');
    if (f && e.target.value.trim() !== '') f.classList.remove('is-invalid');
  });

  // - año del footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// - videos de fondo: fundido, carga diferida y pausa fuera de pantalla
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
