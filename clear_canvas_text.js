const fs = require('fs');
const https = require('https');

const outputPath = 'public/wp-content/themes/fatmanur/app.js';
const url = 'https://davidwhyte.com/wp-content/themes/davidwhyte/app.js';

console.log("Orijinal app.js indiriliyor...");

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("İndirme tamamlandı, metinler temizleniyor...");

        let content = data;

        // 1. WebGL içindeki JSON verisini bul ve metinleri boşluk (' ') ile değiştir
        const regex = /JSON\.parse\('(\{"width":400,"height":2304[^}]+\})'\)/;
        const match = content.match(regex);

        if (match) {
            try {
                // String içerisindeki escape karakterlerini JS için düzeltip JSON parse ediyoruz
                let rawJson = match[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'");

                // Bazen newline karakteri \\n olarak kalıyor JSON.parse çöküyor.
                rawJson = rawJson.replace(/\\\\n/g, '\\n');

                const dataObj = JSON.parse(rawJson);

                // Orijinal dizinin boyutlarını ve yapısını bozmadan SADECE içindeki metinleri boşlukla değiştiriyoruz.
                // Bu sayede WebGL/Three.js render döngüsünde "undefined" hatası verip SAYFAYI DONDURMAYACAK.
                dataObj.paragraphs = dataObj.paragraphs.map(
                    paragraphGroup => paragraphGroup.map(line => " ")
                );

                // Tekrar güvenli string'e çeviriyoruz
                const newJsonStr = JSON.stringify(dataObj);
                const safeJsStr = newJsonStr.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

                content = content.replace(match[0], `JSON.parse('${safeJsStr}')`);
                console.log("✅ WebGL canvas metinleri GÜVENLİ bir şekilde temizlendi!");
            } catch (e) {
                console.log("❌ JSON parse hatası:", e);
                // Güvenlik yedeği: string replace
                const fallbackStr = `JSON.parse('{"width":400,"height":2304,"fontSize":"30px","lineHeight":48,"paragraphs":[[" "," "," "," "," "," "],[" "," "," "],[" "," "," "," "," "," "," "],[" "," "," "," "," "]]}')`;
                content = content.replace(match[0], fallbackStr);
                console.log("✅ WebGL metinleri (Yedek yöntemle) temizlendi.");
            }
        } else {
            console.log("❌ Paragraf target bulunamadı!");
        }

        // 2. Eğer diğer yerlerde (HTML içine enjekte edilen) David Whyte etiketleri varsa onları da SİL
        const replacements = [
            { target: "David Whyte", replacement: " " },
            { target: "David's", replacement: " " },
            { target: "You start", replacement: " " }
        ];

        replacements.forEach(({ target, replacement }) => {
            let count = 0;
            // Tüm eşleşmeleri boşlukla değiştir
            while (content.includes(target) && count < 100) {
                content = content.replace(target, replacement);
                count++;
            }
            if (count > 0) console.log(`✅ Kalan metinler silindi: "${target}" (${count} kez)`);
        });

        // Dosyaya yaz
        fs.writeFileSync(outputPath, content, 'utf8');
        console.log("✅ Temiz app.js kaydedildi.");
    });
}).on('error', (err) => {
    console.error("İndirme hatası:", err.message);
});
