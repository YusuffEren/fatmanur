const fs = require('fs');
let txt = fs.readFileSync('public/index.html', 'utf8');

// The text is extracted from sections with these classes according to three.js
txt = txt.replace(/<div class="xp-text" data-section="\d+">[\s\S]*?<\/div>\s*<\/div>/g, '<div class="xp-text"></div></div>');
txt = txt.replace(/<div class="xp-fulltext">[\s\S]*?<\/div>\s*<\/div>/g, '<div class="xp-fulltext"></div></div>');

fs.writeFileSync('public/index.html', txt);
console.log('Texts purged from HTML.');
