# رغد | Raghad — Approved Logo System

**Status:** Approved & Locked — Business Owner 2026-08-10  
**Direction:** Version A — Seal architecture × geometric wordmark (concepts 2 × 3)  
**Seal word scale:** 70% of inner ring diameter (measured against badge design rules)  
**Usage rules:** [`../LOGO_GUIDELINES.md`](../LOGO_GUIDELINES.md)  
**Brief / process:** [`../logo-concepts/LOGO_DESIGN_BRIEF.md`](../logo-concepts/LOGO_DESIGN_BRIEF.md)  
**Rebuild:** `npm run export` in `tools/logo-pipeline/`

## Folder Map

| Path | Contents |
| :--- | :--- |
| `masters/` | Source SVG masters (edit these only via the pipeline) |
| `png/` | Full-color PNG exports (white bg + transparent) |
| `mono/` | Plum, black, and white-knockout variants |
| `favicon/` | 16 / 32 / 48 / 180px favicon & apple-touch |

## Primary Assets

| Role | File |
| :--- | :--- |
| Standalone mark (avatar / favicon / stamp) | `masters/raghad-seal.svg` |
| Arabic wordmark | `masters/raghad-wordmark.svg` |
| Stacked lockup | `masters/raghad-lockup-stacked.svg` |
| Horizontal lockup | `masters/raghad-lockup-horizontal.svg` |

## أين تستخدم كل ملف (دليل عملي)

| المكان | الملف المستخدم | لماذا |
| :--- | :--- | :--- |
| **هيدر الموقع** (شريط علوي عريض) | `masters/raghad-lockup-horizontal.svg` أو `png/raghad-lockup-horizontal-400px.png` | أفقية: ختم + كلمة + RAGHAD تناسب الشريط |
| **هيدر الموبايل** (مساحة ضيقة) | `masters/raghad-seal.svg` أو `png/raghad-seal-64px.png` | الختم وحده أوضح وأصغر |
| **فافيكون المتصفح** (أيقونة التبويب) | `favicon/favicon-32px.png` (و`16px` إن لزم) | مقاس صغير جدًا — الختم فقط |
| **أيقونة الموبايل / حفظ الشاشة** | `favicon/apple-touch-icon-180px.png` | مقاس Apple القياسي |
| **فيسبوك — صورة الصفحة (Avatar)** | `png/raghad-seal-512px.png` | دائرية، تُقص كدائرة — الختم مصمم لهذا |
| **إنستغرام — صورة الحساب** | نفس الختم `png/raghad-seal-512px.png` | نفس السبب |
| **واتساب Business** | `png/raghad-seal-512px.png` أو `256px` | أفيتار دائري |
| **غلاف فيسبوك / كفر عريض** | `png/raghad-lockup-horizontal-1400px.png` | لو محتاج علامة داخل الغلاف — لا تملأ الغلاف كله بالشعار |
| **واتساب / رسائل — توقيع أو هيدر** | `raghad-lockup-horizontal` أو الكلمة وحدها | حسب العرض المتاح |
| **ستيكر الكرتونة / ختم المعاينة** | `masters/raghad-seal.svg` مطبوع | الختم = معنى الفحص والجودة |
| **صور المنتجات (watermark خفيف)** | `mono/raghad-wordmark-white.svg` بشفافية منخفضة | لا تستخدم الختم الملون فوق الصور |
| **خلفية داكنة (إعلان / بنر)** | `mono/raghad-seal-white-knockout` أو `mono/raghad-wordmark-white` | أبيض على داكن |
| **طباعة أبيض وأسود** | `mono/raghad-seal-black` أو `mono/raghad-wordmark-black` | لون واحد |
| **عرض براند / ملف تعريفي / مطبوعات** | `png/raghad-lockup-stacked-1000px.png` | الشكل الرأسي الكامل أنسب للوحة |

### قاعدة سريعة

- **دائري / صغير** → الختم (`raghad-seal`)
- **شريط أفقي** → الـ lockup الأفقي
- **صفحة أو لوحة مربعة** → الـ lockup الرأسي (stacked)
- **نص فقط بجانب عناصر أخرى** → الكلمة (`raghad-wordmark`)
- **خلفية غامقة أو طباعة** → مجلد `mono/`

### أول ما تغيّره على المتجر الحالي (`raghadkids.com`)

1. أفيتار فيسبوك / إنستغرام / واتساب → `png/raghad-seal-512px.png`
2. هيدر الموقع → `raghad-lockup-horizontal` (أو الختم على الموبايل)
3. فافيكون المتجر → `favicon/favicon-32px.png`

## Colors in the Mark

| Element | Value |
| :--- | :--- |
| Seal fill | `#D48C80` Warm Terracotta |
| Seal letters / ring | `#FFFFFF` |
| Wordmark letters | `#2C2230` Slate Plum |
| Ghain accent dot (wordmark) | `#D48C80` |

Pillars (Kids / Home / Bridal) do **not** receive separate logos — BRAND-020.
