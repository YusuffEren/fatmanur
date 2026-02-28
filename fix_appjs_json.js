const fs = require('fs');
const https = require('https');

const outputPath = 'public/wp-content/themes/fatmanur/app.js';
const url = 'https://davidwhyte.com/wp-content/themes/davidwhyte/app.js';

console.log("Original app.js indiriliyor...");

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("İndirme tamamlandı, değişiklikler uygulanıyor...");

        let content = data;

        // Yeni paragraf verimiz
        const dataObj = {
            width: 400,
            height: 2304,
            fontSize: "30px",
            lineHeight: 48,
            paragraphs: [
                ["Fatmanur Koru", "22 yaşında,", "aslen Sivaslı ama", "İstanbul'da yaşıyor.", "Evin en küçüğü,", "o yüzden biraz prenseslik var."],
                ["İstanbul Üniversitesinde", "Şehir Bölge Planlama", "okuyor."],
                ["Yeşili, matchayı,", "broş takmayı", "çok seviyor."],
                ["Sivas milliyetçisi,", "kendini enik sanıyor.", "Avokado ve suşi", "toplumun sevmediği", "şeyleri çok seviyor."],
                ["En sevdiği kelimelerden biri", "“deneyimmmm”", "(en az birkaç m ile)."],
                ["Yani aslında", "daha yeni yeni tanıdığım için", "buraya detaylı bilgileri", "ilerleyen zamanlarda", "yüklemeye devam edeceğim."],
                ["(Bana soyadını bile söylemedi,", "ben kendisini ve", "Madımak faili dedesini buldum.)"]
            ]
        };

        // JSON'a çevir
        const jsonStr = JSON.stringify(dataObj);

        // JavaScript içinde tek tırnaklı literal'e koyulacağı için, 
        // JSON içindeki olası backslash'leri çiftlememiz ve tek tırnakları kaçmamız gerekiyor
        const safeJsStr = jsonStr.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        // Orijinal içerikteki yeri bul
        // JSON.parse('{"width":400,"height":2304...}')
        const regex = /JSON\.parse\('\{"width":400,"height":2304[^}]+\}'\)/;

        if (regex.test(content)) {
            content = content.replace(regex, `JSON.parse('${safeJsStr}')`);
            console.log("✅ Şiir paragrafları başarıyla değiştirildi (JSON formatı korundu)!");
        } else {
            console.log("❌ Paragraf target bulunamadı!");
        }

        // Diğer basit isim değişiklikleri
        const replacements = [
            { target: "David Whyte", replacement: "Fatmanur Koru" },
            { target: "David's", replacement: "Fatmanur'un" },
            { target: "You start", replacement: "Fatmanur Koru" }
        ];

        replacements.forEach(({ target, replacement }) => {
            let count = 0;
            while (content.includes(target)) {
                content = content.replace(target, replacement);
                count++;
            }
            console.log(`✅ Detay metni: "${target}" -> "${replacement}" (${count} kez)`);
        });

        // Dosyaya yaz
        fs.writeFileSync(outputPath, content, 'utf8');
        console.log("✅ app.js kaydedildi.");
    });
}).on('error', (err) => {
    console.error("İndirme hatası:", err.message);
});
