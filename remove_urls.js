const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Replace all varying hrefs starting with https://davidwhyte.com... with '#'
html = html.replace(/href="https:\/\/davidwhyte\.com[^"]*"/gi, 'href="#"');

// Also catch the https://www.invitas.net link if any
html = html.replace(/href="https:\/\/www\.invitas\.net[^"]*"/gi, 'href="#"');

fs.writeFileSync('public/index.html', html);
console.log('URLs scrubbed successfully.');
