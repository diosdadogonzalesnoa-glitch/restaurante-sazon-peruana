// Se ejecuta en Netlify al desplegar: escribe el número de WhatsApp en js/config.js
// a partir de la variable de entorno WHATSAPP_NUMBER (solo dígitos, con código de país).
const fs = require('fs');
const path = require('path');

const number = String(process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
const file = path.join(__dirname, '..', 'js', 'config.js');
const src = fs.readFileSync(file, 'utf8');
const out = src.replace(/whatsapp:\s*'[^']*'/, `whatsapp: '${number}'`);
fs.writeFileSync(file, out);
console.log(number ? 'WhatsApp configurado desde WHATSAPP_NUMBER.' : 'WHATSAPP_NUMBER vacío: sitio en modo demostración.');
