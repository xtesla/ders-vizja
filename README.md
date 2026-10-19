# Ders Vizja

Üniversite dersleri için statik takip sayfası. Dokuz dersin toplam on dört W/L/C grubu, paylaşılan ekran görüntüsüne göre girildi. Ekran görüntüsünde kesilen ders adlarının tam yazımı ve gruplar ileride doğrulanabilir.

Her dersin ayrıntıları `courses/<ders>.json` dosyasındadır. İki gruplu derslerde her grubun hocası, gereklilikleri, puan sistemi, ödevleri ve notları `groups` altında ayrı tutulur. Ayrı ders sohbetleri yalnızca ilgili dosyayı güncelleyebilir:

```json
{
  "groups": {
    "W1": { "instructor": "", "requirements": "", "grading": [], "assignments": [], "notes": "" },
    "L3": { "instructor": "", "requirements": "", "grading": [], "assignments": [], "notes": "" }
  }
}
```

Tek gruplu derslerde bu alanlar `groups` olmadan doğrudan dosyada bulunur. `grading` öğeleri `{ "name": "Final", "weight": "%40", "note": "" }`, `assignments` öğeleri `{ "title": "Ödev 1", "description": "", "due": "2026-11-01", "status": "Yapılacak" }` biçimindedir.

Henüz doğrulanmamış hoca, puan ve ödev bilgileri boş tutulur. Yerel önizleme için bu klasörde statik bir HTTP sunucusu açılır. GitHub Pages yayımlama kaynağı olarak bu klasörün içeriği kullanılabilir.

**Gizlilik:** Kişisel GitHub hesabında GitHub Pages sitesi herkese açıktır; kaynak depo özel olsa da sayfa içeriği özel olmaz. Ders verilerini yayımlamadan önce bu durum dikkate alınmalıdır.
