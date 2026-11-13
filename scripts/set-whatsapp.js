// - en netlify pone WHATSAPP_NUMBER en js/config.js
const fs = require('fs');
const path = require('path');

const number = String(process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
const file = path.join(__dirname, '..', 'js', 'config.js');
const src = fs.readFileSync(file, 'utf8');
const out = src.replace(/whatsapp:\s*'[^']*'/, `whatsapp: '${number}'`);
fs.writeFileSync(file, out);
console.log(number ? 'WhatsApp configurado desde WHATSAPP_NUMBER.' : 'WHATSAPP_NUMBER vacío: sitio en modo demostración.');
