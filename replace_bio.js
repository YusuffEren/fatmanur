const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\yusuf\\Desktop\\fatmanur\\app.js', 'utf8');

const target = '["You start","with a painter’s hand","working up color","from a dark palette","of remembrance","(from “The Painter’s Hand”)"]';
const replacement = JSON.stringify([
    'Fatmanur Koru 22 yaşında,',
    'aslen Sivaslı ama İstanbul\\'da yaşıyor.',
    'Evin en küçüğü, o yüzden biraz prenseslik var.',
    'İstanbul Üniversitesinde Şehir Bölge Planlama okuyor.',
    'Yeşili, matchayı, broş takmayı çok seviyor.',
    'Sivas milliyetçisi, arada bir kendini enik sanıyor.',
    'Avokado, suşi ve toplumun genelinin',
    'pek sevmediği diğer şeyleri çok seviyor.',
    'En sevdiği kelimelerden biri "deneyimmmm"',
    '(en az birkaç m ile).',
    'Arada bir hakkında "eserekli" diyenler var, aldırmayın.',
    'Yani aslında ben de daha yeni yeni tanıdığım için',
    'buraya detaylı bilgileri ilerleyen zamanlarda yüklemeye',
    'devam edeceğim. (Bana soyadını bile söylemedi,',
    'ben kendisini ve Madımak faili dedesini buldum.)'
]);

const newContent = content.replace(target, replacement);

const targetDir = 'c:\\\\Users\\\\yusuf\\\\Desktop\\\\fatmanur\\\\public\\\\wp-content\\\\themes\\\\fatmanur';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetDir + '\\\\app.js', newContent);
console.log('Successfully replaced and saved app.js');
