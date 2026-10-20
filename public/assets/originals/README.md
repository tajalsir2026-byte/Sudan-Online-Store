# 📸 كيفية إضافة الأيقونة الأصلية والبانر

## ⚠️ مهم جداً - يجب قراءة هذا الملف

لإكمال إعداد التطبيقات، يجب عليك إضافة صورتين إلى المشروع:

---

## 📁 المسار المطلوب

ضع الصور في المجلد التالي:

```
public/assets/originals/
```

---

## ️ الصور المطلوبة

### 1. الأيقونة الأصلية (إلزامي)

- **اسم الملف:** `sanad-icon.png`
- **المسار:** `public/assets/originals/sanad-icon.png`
- **الحجم الموصى به:** 512×512 بكسل أو أكبر
- **الصيغة:** PNG مع خلفية شفافة (اختياري)

**مصدر الصورة:** الأيقونة التي أرسلتها في المحادثة (الخضراء مع سحابة وعربة)

---

### 2. البانر الترويجي (اختياري - لصفحة Landing)

- **اسم الملف:** `sanad-banner.png`
- **المسار:** `public/assets/originals/sanad-banner.png`
- **الحجم الموصى به:** 1920×1080 بكسل أو 1200×630 بكسل
- **الصيغة:** PNG أو JPG

**مصدر الصورة:** البانر الترويجي الذي أرسلته في المحادثة

---

## 📋 خطوات الإضافة

### الطريقة 1: عبر GitHub Web Interface

1. اذهب إلى: https://github.com/tajalsir2026-byte/Sudan-Online-Store
2. انتقل إلى مجلد `public/assets/originals/`
3. اضغط **Add file** → **Upload files**
4. اسحب الصورتين أو اخترهما من جهازك
5. اضغط **Commit changes**

### الطريقة 2: عبر Git (محلياً)

```bash
# 1. انسخ الصور إلى المجلد
cp /path/to/sanad-icon.png ./public/assets/originals/
cp /path/to/sanad-banner.png ./public/assets/originals/

# 2. أضف التغييرات
git add public/assets/originals/

# 3. Commit
git commit -m "feat: إضافة الأيقونة الأصلية والبانر"

# 4. Push
git push origin main
```

---

## ✅ بعد إضافة الصور

بعد رفع الصور، ستلاحظ:

1. **الأيقونة الأصلية** ستظهر في:
   - شاشة الـ Splash عند فتح التطبيقات
   - أيقونة التطبيق المثبت على الهاتف
   -_manifest.json لكل تطبيق

2. **البانر** (اختياري) يمكن استخدامه في:
   - صفحة Landing
   - صفحات الترويج
   - Social Media sharing (Open Graph)

---

## 🎨 الأيقونات الاحتياطية

إذا لم تُضف الأيقونة الأصلية، سيستخدم التطبيق الأيقونات المولدة تلقائياً الموجودة في:
```
public/icons/
├── admin-192.png
├── admin-512.png
├── merchant-192.png
├── merchant-512.png
├── client-192.png
└── client-512.png
```

---

## 🔍 التحقق من نجاح الإضافة

بعد رفع الصور، افتح المتصفح وادخل على:

```
https://sudan-online-store.vercel.app/assets/originals/sanad-icon.png
```

يجب أن ترى الأيقونة الأصلية.

---

##  تأثير الصور على PWA Score

إضافة الأيقونة الأصلية ستحسن:
- ✅ **Manifest Score**: من 16 إلى ~40+
- ✅ **App Identity**: الأيقونة ستظهر بشكل صحيح
- ✅ **Install Experience**: تجربة تثبيت أفضل

---

**منصة سند — SANAD POS & COMMERCE**  
**20 أكتوبر 2026**
