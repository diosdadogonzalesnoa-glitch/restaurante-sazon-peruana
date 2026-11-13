# Sazón Peruana — Restaurante Criollo

Sitio web de demostración para **Sazón Peruana**, un restaurante criollo peruano **ficticio** ubicado en Ica.
Es una página estática (HTML, CSS y JavaScript, sin frameworks ni base de datos), con estética editorial: lienzo color pergamino, títulos serif ligeros, un único acento color azafrán, fotografía a pantalla completa y videos de fondo con movimiento sutil.

> ⚠️ Restaurante, dirección, teléfono, correo, precios y reseñas son **de muestra**.

## Secciones

| Sección | Contenido |
|---|---|
| Portada | Video de fondo (Video 1), titular, horario y acceso a reservas |
| Introducción | «El espíritu de la mesa criolla» |
| Franja de platos | Nombres de platos en movimiento continuo |
| La carta | 8 platos destacados + botón **Ver carta completa** (abre el PDF) |
| Platos clásicos | Video de fondo (Video 2) |
| Bebidas | Lista de tragos con la foto fija mientras se desplaza |
| Celebraciones | Almuerzos familiares, eventos privados, pedidos para llevar |
| Nuestra historia | «Hecho con cucharón de palo» |
| Opiniones | Reseñas de muestra |
| Reservas | Formulario que arma el mensaje y abre WhatsApp |
| Contacto y pie | Dirección, horario, mapa y logo |

## Estructura

```
├── index.html                 Página principal
├── css/styles.css             Estilos
├── js/
│   ├── config.js              Configuración (número de WhatsApp)
│   └── main.js                Menú, reservas, videos, animaciones
├── assets/
│   ├── img/                   Logos (sp-*.png)
│   │   └── web/               Fotos optimizadas que usa la página
│   ├── video/                 Video 1 y Video 2 (+ versiones "movil" para celulares)
│   └── carta/                 Carta completa en PDF
├── _fuente/carta.html         Diseño fuente de la carta en PDF
├── scripts/set-whatsapp.js    Inyecta el número de WhatsApp al desplegar en Netlify
└── netlify.toml               Configuración de despliegue en Netlify
```

Las fotos originales en alta resolución se guardan en `assets/img/originales/`, que **no se sube** al repositorio (ver `.gitignore`).

## Ver el sitio en tu computadora

Basta con un servidor estático. Con Node.js instalado:

```bash
npx http-server -p 5173 -c-1
```

y abre `http://localhost:5173`.
(Abrir `index.html` con doble clic también funciona, pero los videos y el mapa se comportan mejor con un servidor.)

## WhatsApp (reservas)

El formulario arma un mensaje formal con los datos del cliente (nombre, personas, fecha y hora) y abre el chat de WhatsApp del restaurante. El cliente solo tiene que pulsar **Enviar**.

El número se configura en `js/config.js`:

```js
window.SITE_CONFIG = {
  whatsapp: "51999888777"   // código de país + número; vacío = modo demostración
};
```

- Para no guardar el número en GitHub, deja ese valor vacío y crea en Netlify (*Site configuration → Environment variables*) la variable `WHATSAPP_NUMBER`. Al desplegar, `scripts/set-whatsapp.js` la escribe en `js/config.js`.
- Una vez publicado, el número es visible en el navegador, porque el enlace de WhatsApp lo necesita.

## Desplegar

**Netlify (recomendado):** *Add new site → Import from GitHub*, elige el repositorio y despliega. `netlify.toml` ya trae la configuración. Después, opcionalmente, agrega `WHATSAPP_NUMBER`.

**GitHub Pages:** *Settings → Pages → Deploy from a branch → main / (root)*.

Sitio publicado: **https://sazon-peruana-demo.netlify.app/**

## Editar la carta en PDF

1. Edita `_fuente/carta.html` (platos, precios, textos).
2. Ábrela con un servidor local: `http://localhost:5173/_fuente/carta.html?p=1` (página 1) y `?p=2` (página 2).
3. Captura cada página en A4 y vuelve a generar `assets/carta/carta-sazon-peruana.pdf`. También puedes imprimir a PDF desde el navegador con márgenes en *Ninguno* y *Gráficos de fondo* activado.

## Tecnología

- HTML5, CSS (variables, grid, `aspect-ratio`, `position: sticky`) y JavaScript sin dependencias.
- Tipografías: Cormorant Garamond (Google Fonts) y Satoshi (Fontshare).
- Videos con fuente distinta para celular y escritorio (`<source media>`); el Video 2 se descarga solo al llegar a su sección.
- Imágenes con carga diferida (`loading="lazy"`).
- Respeta la preferencia del sistema de *reducir movimiento*.
