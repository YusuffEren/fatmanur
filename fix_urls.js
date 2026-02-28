const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Replace all absolute URLs to davidwhyte.com/wp- with just /wp-
// We match specifically 'https://davidwhyte.com/wp-' and "https://davidwhyte.com/wp-"
html = html.replace(/"https:\/\/davidwhyte\.com\/wp-/g, '"/wp-');
html = html.replace(/'https:\/\/davidwhyte\.com\/wp-/g, "'/wp-");

fs.writeFileSync('public/index.html', html);
console.log('Done!');
