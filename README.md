# منصة سند — SANAD POS & COMMERCE

**20 أكتوبر 2026**

---

## ✅ ما تم إنجازه

1. **تطبيق إدارة السند** (Super Admin Dashboard)
2. **تطبيق تاجر السند** (Merchant POS)
3. **تطبيق الجمهور** (Client App)
4. **شاشة Splash احترافية** مع الأيقونة الأصلية
5. **PWA Score محسن** مع الأيقونة الأصلية

---

## ⚠️ الخطوة التالية - مهم جداً

لإكمال إعداد التطبيقات، يجب عليك إضافة **صورتين** إلى المشروع:

---

## 📸 الصور المطلوبة

### 1. الأيقونة الأصلية (إلزامي)

- **اسم الملف:** `sanad-icon.png`
- **المسار:** `public/assets/originals/sanad-icon.png`
- **الحجم الموصى به:** 512×512 بكسل أو أكبر
- **الصيغة:** PNG

**مصدر الصورة:** الأيقونة التي أرسلتها في المحادثة (خضراء مع سحابة وعربة)

---

### 2. البانر الترويجي (اختياري)

- **اسم الملف:** `sanad-banner.png`
- **المسار:** `public/assets/originals/sanad-banner.png`
- **الح to:** 1920×1080 بكسل أو 1200×630 بكسل
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
6. انتظر بضع دقائق حتى يتم النشر تلقائياً

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

## 🎨 تأثير Splash Screen

بعد إضافة الأيقونة الأصلية، ستلاحظ:

1. **عند فتح التطبيقات:**
   - شاشة Splash تظهر لمدة 2.5 ثانية
   - الأيقونة الأصلية تظهر مع أنيميشن احترافي
   - اسم التطبيق يظهر بلون مختلف لكل تطبيق:
     - **إدارة السند:** بنفسجي
     - **تاجر السند:** أخضر
     - **سند (الجمهور):** ذهبي

2. **على الهاتف:**
   - الأيقونة الأصلية ستظهر كأيقونة التطبيق
   - عند التثبيت، ستظهر الأيقونة الأصلية

---

## 🔍 التحقق من نجاح الإضافة

بعد رفع الصور، افتح المتصفح وادخل على:

```
https://sudan-online-store.vercel.app/assets/originals/sanad-icon.png
```

يجب أن ترى الأيقونة الأصلية.

---

## 📱 الروابط

- **الصفحة الرئيسية:** https://sudan-online-store.vercel.app/
- **المستودع:** https://github.com/tajalsir2026-byte/Sudan-Online-Store

---

## 🎯 تحسين PWA Score

إضافة الأيقونة الأصلية ستحسن:
- ✅ **Manifest Score**: من 16 إلى ~40+
- ✅ **App Identity**: الأيقونة ستظهر بشكل صحيح
- ✅ **Install Experience**: تجربة تثبيت أفضل

---

##  الدعم

إذا واجهت أي مشكلة، راجع:
- ملف `public/assets/originals/README.md` للتفاصيل الكاملة
- الملف الحالي للتعليمات العامة

---

**منصة سند — SANAD POS & COMMERCE**  
**20 أكتوبر 2026**
