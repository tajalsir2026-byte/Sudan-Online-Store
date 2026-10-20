# 📱 دليل بناء APKs لمنصة سند

> **التاريخ:** 20 أكتوبر 2026

---

##  نظرة عامة

هذا الدليل يشرح كيفية بناء **3 تطبيقات Android APK** لمنصة سند:

| التطبيق | Package ID | URL | اللون |
|---------|-----------|-----|-------|
| إدارة السند | `sd.sanad.admin` | `/admin` | بنفسجي |
| تاجر السند | `sd.sanad.merchant` | `/merchant` | أخضر |
| سند (الجمهور) | `sd.sanad.client` | `/client` | ذهبي |

---

## 📋 المتطلبات

### 1. Node.js 18+
```bash
node --version  # يجب أن يكون v18 أو أحدث
```

### 2. Java JDK 17+
```bash
java --version  # يجب أن يكون 17 أو أحدث
```

### 3. Android SDK
```bash
# تحميل Android Studio من: https://developer.android.com/studio
# أو تحميل Command Line Tools فقط

# تعيين المتغيرات البيئية
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

---

## 🚀 الطريقة 1: البناء التلقائي (موصى به)

```bash
# 1. الانتقال إلى مجلد البناء
cd android-builds

# 2. إعطاء صلاحيات التنفيذ
chmod +x build-all.sh

# 3. تشغيل السكريبت
./build-all.sh
```

بعد الانتهاء، ستجد 3 ملفات APK:
```
sanad-admin.apk      ← إدارة المنصة
sanad-merchant.apk   ← تاجر السند
sanad-client.apk     ← تطبيق الجمهور
```

---

## 🔧 الطريقة 2: البناء اليدوي (تطبيق واحد)

### بناء تطبيق الإدارة:
```bash
cd android-builds/admin-app
npm install
npx cap sync android
cd android
./gradlew assembleDebug
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk ../sanad-admin.apk
```

### بناء تطبيق التاجر:
```bash
cd android-builds/merchant-app
npm install
npx cap sync android
cd android
./gradlew assembleDebug
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk ../sanad-merchant.apk
```

### بناء تطبيق الجمهور:
```bash
cd android-builds/client-app
npm install
npx cap sync android
cd android
./gradlew assembleDebug
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk ../sanad-client.apk
```

---

## 🌐 الطريقة 3: PWA (بدون بناء APK)

إذا كنت تريد تثبيت التطبيق **فوراً** بدون بناء APK:

### 1. نشر المشروع على Vercel/Netlify
```bash
npm run build
# ثم ارفع مجلد dist/ على Vercel
```

### 2. فتح الموقع على Android Chrome
```
https://sudan-online-store.vercel.app
```

### 3. تثبيت PWA
- اضغط على القائمة (⋮) في Chrome
- اختر "تثبيت التطبيق" أو "Add to Home Screen"
- سيظهر التطبيق على الشاشة الرئيسية

**المميزات:**
- ✅ فوري (لا يحتاج بناء)
- ✅ يعمل Offline
- ✅ تحديثات تلقائية
- ❌ لا يظهر في Google Play

---

##  تخصيص الأيقونات

### الأيقونات الحالية:
الأيقونات الافتراضية موجودة في:
```
android-builds/
├── admin-app/icon.png
├── merchant-app/icon.png
└── client-app/icon.png
```

### لإنشاء أيقونات احترافية:
1. استخدم [Icon Kitchen](https://icon.kitchen/)
2. ارفع الشعار الخاص بك
3. اختر الألوان والأشكال
4. حمّل الحزمة واستبدل الملفات في `android/app/src/main/res/`

---

## 🔐 بناء نسخة Release (للنشر)

### 1. إنشاء Keystore:
```bash
keytool -genkey -v -keystore sanad-release.keystore -alias sanad -keyalg RSA -keysize 2048 -validity 10000
```

### 2. إضافة التوقيع في `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../sanad-release.keystore")
            storePassword "your-store-password"
            keyAlias "sanad"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. بناء APK الموقع:
```bash
./gradlew assembleRelease
```

---

## ❓ حل المشاكل الشائعة

### المشكلة: `JAVA_HOME is not set`
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

### المشكلة: `SDK location not found`
```bash
# أنشئ ملف android/local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### المشكلة: `Gradle build failed`
```bash
# مسح Cache وإعادة البناء
./gradlew clean
./gradlew assembleDebug
```

### المشكلة: `app-debug.apk not found`
```bash
# تأكد من نجاح البناء
./gradlew assembleDebug --info
```

---

## 📊 مقارنة الطرق

| الطريقة | السرعة | الجودة | Offline | Play Store |
|---------|--------|--------|---------|------------|
| APK Debug | سريع | جيد | ✅ |  |
| APK Release | متوسط | ممتاز | ✅ | ✅ |
| PWA | فوري | جيد | ✅ | ❌ |

---

## 🎯 التوصيات

### للمطورين (اختبار):
استخدم **APK Debug** أو **PWA**

### للنشر الداخلي (فريق العمل):
استخدم **APK Release** مع توزيع عبر Firebase App Distribution

### للنشر العام:
استخدم **APK Release** وارفعه على Google Play Store

---

##  الدعم

للمساعدة أو الاستفسارات:
- 📧 support@sanad.sd
- 📱 WhatsApp: 0912345678

---

**منصة سند — SANAD POS & COMMERCE**  
**20 أكتوبر 2026**
