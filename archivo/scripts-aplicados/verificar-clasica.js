const fs = require('fs');
const data = JSON.parse(fs.readFileSync('D:/Users/User/Desktop/CLAUDE/PAGINA WEB/carta-data.json', 'utf8'));

const coctel = data.categories.find(c => c.id === 'cocteleria');
const clasica = coctel.groups.find(g => g.title.es === 'Clásica');

console.log('Total items en Clásica:', clasica.items.length);
let iguales = [];
clasica.items.forEach(it => {
  if (it.desc.es === it.desc.en) iguales.push(it.name);
});
console.log('Siguen con desc.es === desc.en (' + iguales.length + '):');
iguales.forEach(n => console.log(' -', n));

// Verifica que el JSON completo sigue siendo válido y con el mismo conteo total de items
let total = 0;
data.categories.forEach(c => c.groups.forEach(g => total += g.items.length));
console.log('Total de productos en toda la carta:', total);
