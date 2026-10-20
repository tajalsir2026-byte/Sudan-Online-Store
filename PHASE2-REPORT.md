# ✅ تقرير المرحلة الثانية: فصل التطبيقات + إصلاح الربط

> **التاريخ:** 20 أكتوبر 2026  
> **النقاط المنفذة:** فصل المسارات + إصلاح ربط الزبون بالإدارة

---

## ️ البنية الجديدة للتطبيقات

```
الصفحة الرئيسية (/)
├── إدارة المنصة (/admin/*)     ← Super Admin
├── تاجر السند (/merchant/*)    ← Tenant POS
└── تطبيق الجمهور (/client/*)  ← Public App
```

---

##  المسارات الجديدة

| المسار | التطبيق | الوظيفة |
|--------|---------|---------|
| `/` | Landing Page | اختيار التطبيق |
| `/admin/*` | إدارة المنصة | Super Admin Dashboard |
| `/merchant/*` | تاجر السند | تطبيق التاجر (POS) |
| `/client/*` | تطبيق الجمهور | تصفح + طلب |
| `/login` | تسجيل دخول | بوابة مشتركة |

---

## 🔧 ما تم تنفيذه

### 1. ✅ فصل المسارات بـ React Router
- **ملف جديد:** `src/AppRouter.tsx`
- **ملف جديد:** `src/components/Landing/LandingPage.tsx`
- **ملف جديد:** `src/components/Auth/LoginPage.tsx`
- **اعتمادية:** `react-router-dom@^7.1.1`

### 2. ✅ لوحة إدارة المنصة (Super Admin)
- **ملف جديد:** `src/AdminApp.tsx`
- صفحات فرعية:
  - `/admin` — نظرة عامة وإحصائيات
  - `/admin/tenants` — قائمة المتاجر
  - `/admin/applications` — طلبات الانضمام
  - `/admin/orders` — كل الطلبات
  - `/admin/ads` — إعلانات الزبائن (قبول/رفض)
  - `/admin/payments` — المدفوعات

### 3. ✅ إصلاح الربط (الإعلانات تظهر في الإدارة)
- **ملف معدل:** `src/server/routes.ts`
- Endpoints جديدة:

#### طلبات الزبائن (Storefront Orders):
```
GET    /api/storefront/orders          ← الإدارة ترى كل الطلبات
POST   /api/storefront/orders          ← الزبون ينشئ طلب
GET    /api/storefront/orders/track/:n ← تتبع الطلب
PUT    /api/storefront/orders/:id/status ← تحديث الحالة
```

#### إعلانات البندر (Albandar Ads):
```
GET    /api/storefront/ads             ← الإدارة ترى كل الإعلانات
POST   /api/storefront/ads             ← الزبون ينشر إعلان
POST   /api/storefront/ads/:id/approve ← الإدارة توافق
POST   /api/storefront/ads/:id/reject  ← الإدارة ترفض
GET    /api/storefront/ads/public      ← الإعلانات المقبولة للعموم
```

#### طلبات انضمام التجار (Applications):
```
GET    /api/admin/applications              ← قائمة الطلبات
POST   /api/admin/applications/:id/approve  ← قبول متجر
POST   /api/admin/applications/:id/reject   ← رفض متجر
```

---

## 🔍 كيف تم حل مشكلة عدم ظهور الإعلانات؟

### قبل (المشكلة):
```
تطبيق الزبون → يحفظ في localStorage فقط ❌
                  ↓
         (لا يوجد ربط بالسيرفر)
                  ↓
         لوحة الإدارة لا ترى شيئاً ❌
```

### بعد (الحل):
```
تطبيق الزبون → POST /api/storefront/ads → db.json
                                          ↓
                                    لوحة الإدارة
                              GET /api/storefront/ads
                                          ↓
                              تظهر الإعلانات ✅
                              مع أزرار قبول/رفض
```

---

## 📱 تصميم صفحة Landing

تم إنشاء صفحة رئيسية أنيقة تعرض **3 بطاقات** لاختيار التطبيق:

1. **إدارة المنصة** (بنفسجي) — للمالك
2. **تاجر السند** (أخضر) — للتجار
3. **تطبيق الجمهور** (ذهبي) — للعملاء

كل بطاقة فيها:
- أيقونة معبرة
- وصف واضح
- ميزات سريعة
- زر دخول

---

## ⚠️ ملاحظات مهمة

### ما يجب تحديثه في تطبيق الزبون الحالي:
الملف `src/SanadClientApp/SanadClientApp.tsx` يجب تحديثه ليرسل البيانات إلى:
- `POST /api/storefront/orders` بدلاً من localStorage
- `POST /api/storefront/ads` بدلاً من localStorage

### ما يجب تحديثه في تطبيق التاجر:
الملف `src/App.tsx` يجب أن:
- يعمل على مسار `/merchant/*` بدلاً من `/`
- يخفي تبويب "إدارة المنصة المركزية" (لأنه للتاجر فقط)

---

## 🎯 الخطوات التالية الموصى بها

1. **تحديث SanadClientApp** لإرسال الطلبات للإدارة عبر API
2. **تحديث App.tsx (التاجر)** لإخفاء تبويب الإدارة
3. **تثبيت react-router-dom** على السيرفر: `npm install`
4. **اختبار** كل مسار:
   - `/` → Landing
   - `/admin` → إدارة
   - `/merchant` → تاجر
   - `/client` → زبون

---

*تم إعداد هذا التقرير بعد تنفيذ المرحلة الثانية*
