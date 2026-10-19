# Ders Vizja

Üniversite dersleri için statik takip sayfası. Dokuz dersin toplam on dört W/L/C grubu, paylaşılan ekran görüntüsüne göre girildi. Ekran görüntüsünde kesilen ders adlarının tam yazımı ve gruplar ileride doğrulanabilir.

Her dersin ayrıntıları `courses/<ders>.json` dosyasındadır. Ayrı ders sohbetleri yalnızca ilgili dosyayı güncelleyebilir:

```json
{
  "instructor": "",
  "requirements": "",
  "grading": [{ "name": "Final", "weight": "%40", "note": "" }],
  "assignments": [{ "title": "Ödev 1", "description": "", "due": "2026-11-01", "status": "Yapılacak" }],
  "notes": ""
}
```

Henüz doğrulanmamış hoca, puan ve ödev bilgileri boş tutulur. Yerel önizleme için bu klasörde statik bir HTTP sunucusu açılır. GitHub Pages yayımlama kaynağı olarak bu klasörün içeriği kullanılabilir.

**Gizlilik:** Kişisel GitHub hesabında GitHub Pages sitesi herkese açıktır; kaynak depo özel olsa da sayfa içeriği özel olmaz. Ders verilerini yayımlamadan önce bu durum dikkate alınmalıdır.
