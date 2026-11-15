// - intro del logo
// - enabled: false la desactiva, speed > 1 la hace mas lenta, < 1 mas rapida
(function () {
  'use strict';

  var CONFIG = {
    enabled: true,
    oncePerSession: true,
    speed: 1
  };

  var el = document.getElementById('splash');
  if (!el) return;

  var root = document.documentElement;
  var KEY = 'sp-intro-vista';
  var timers = [];
  var finished = false;
  var k = 1;

  function seen() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* - sin storage: se muestra otra vez, no pasa nada */ }
  }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  // - quita la capa y devuelve el scroll, pase lo que pase
  function cleanup() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    root.classList.remove('splash-lock');
    document.removeEventListener('keydown', onKey);
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  // - salida suave: el logo crece un poco, la capa se desvanece y el blur se va
  function leave() {
    if (finished || el.classList.contains('is-leaving')) return;
    markSeen();
    el.classList.add('is-leaving');
    later(cleanup, 480 * k);
  }

  function onKey(e) {
    if (e.key === 'Escape') leave();
  }

  if (!CONFIG.enabled || (CONFIG.oncePerSession && seen())) {
    el.parentNode.removeChild(el);
    return;
  }

  try {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    k = reduce ? 1 : Math.max(0.25, Number(CONFIG.speed) || 1);
    el.style.setProperty('--splash-k', String(k));
    if (reduce) el.classList.add('is-reduced');

    el.hidden = false;
    root.classList.add('splash-lock');
    el.addEventListener('click', leave);
    document.addEventListener('keydown', onKey);

    // - seguridad: la capa nunca se queda tapando la pagina
    later(cleanup, 6500 * k);

    // - precarga: espera a que todas las piezas esten listas antes de animar
    var imgs = Array.prototype.slice.call(el.querySelectorAll('img'));
    var ready = Promise.all(imgs.map(function (img) {
      if (img.complete) return img.naturalWidth ? Promise.resolve() : Promise.reject();
      return new Promise(function (ok, fail) {
        img.addEventListener('load', ok, { once: true });
        img.addEventListener('error', fail, { once: true });
      });
    }));
    var tooSlow = new Promise(function (ok, fail) { later(fail, 2500); });

    Promise.race([ready, tooSlow]).then(function () {
      if (finished) return;
      el.classList.add('is-playing');
      // - 3.05 s de animacion (armado + color), luego la salida (~0.45 s)
      later(leave, (reduce ? 1100 : 3050) * k);
    }, function () {
      // - si las imagenes fallan o tardan demasiado, se retira sin animar
      leave();
    });
  } catch (err) {
    cleanup();
  }
})();
