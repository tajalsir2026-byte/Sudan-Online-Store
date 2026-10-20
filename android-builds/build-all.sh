#!/bin/bash
# ==========================================
# سكريبت بناء APKs لمنصة سند
# يبني الثلاث تطبيقات تلقائياً
# ==========================================

set -e  # إيقاف عند حدوث خطأ

echo "=========================================="
echo "🚀 بدء بناء تطبيقات منصة سند"
echo "=========================================="

# التحقق من المتطلبات
check_requirements() {
  echo ""
  echo "🔍 التحقق من المتطلبات..."
  
  if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيته من: https://nodejs.org"
    exit 1
  fi
  
  if ! command -v java &> /dev/null; then
    echo "❌ Java غير مثبتة. يرجى تثبيت JDK 17+ من: https://adoptium.net"
    exit 1
  fi
  
  if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME غير محدد. يرجى تعيينه:"
    echo "   export ANDROID_HOME=\$HOME/Android/Sdk"
    echo ""
  fi
  
  echo "✅ المتطلبات الأساسية متوفرة"
}

# بناء تطبيق واحد
build_app() {
  local app_name=$1
  local app_dir=$2
  
  echo ""
  echo "=========================================="
  echo "📱 بناء: $app_name"
  echo "=========================================="
  
  cd "$app_dir"
  
  echo "1️⃣  تثبيت الاعتماديات..."
  npm install
  
  echo "2️⃣  مزامنة Android..."
  npx cap sync android
  
  echo "3️⃣  بناء APK (Debug)..."
  cd android
  ./gradlew assembleDebug
  
  echo "4️⃣  نقل APK إلى المجلد الرئيسي..."
  cp app/build/outputs/apk/debug/app-debug.apk ../../${app_name}.apk
  
  echo "✅ تم بناء $app_name بنجاح!"
  cd ../..
}

# التنفيذ الرئيسي
check_requirements

echo ""
echo "📊 التطبيقات المطلوب بناؤها:"
echo "  1. إدارة السند (Admin)"
echo "  2. تاجر السند (Merchant)"  
echo "  3. سند - تطبيق الجمهور (Client)"
echo ""

build_app "sanad-admin" "./admin-app"
build_app "sanad-merchant" "./merchant-app"
build_app "sanad-client" "./client-app"

echo ""
echo "=========================================="
echo "🎉 تم بناء جميع التطبيقات بنجاح!"
echo "=========================================="
echo ""
echo "📁 ملفات APK:"
echo "  - sanad-admin.apk     (إدارة المنصة)"
echo "  - sanad-merchant.apk  (تاجر السند)"
echo "  - sanad-client.apk    (تطبيق الجمهور)"
echo ""
echo "📲 يمكن تثبيتها على Android مباشرة"
echo "=========================================="
