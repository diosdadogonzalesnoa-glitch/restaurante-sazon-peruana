// - en netlify, si existe WHATSAPP_NUMBER, reemplaza el numero de js/config.js
const fs = require('fs');
const path = require('path');

const number = String(process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
if (!number) {
  console.log('Sin WHATSAPP_NUMBER: se usa el número de js/config.js.');
  process.exit(0);
}
const file = path.join(__dirname, '..', 'js', 'config.js');
const src = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, src.replace(/whatsapp:\s*'[^']*'/, `whatsapp: '${number}'`));
console.log('WhatsApp configurado desde WHATSAPP_NUMBER.');
