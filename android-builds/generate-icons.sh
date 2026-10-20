#!/bin/bash
# ==========================================
# سكريبت توليد الأيقونات بصيغ متعددة
# يحتاج: ImageMagick (convert)
# ==========================================

echo "🎨 توليد الأيقونات..."

# التحقق من ImageMagick
if ! command -v convert &> /dev/null; then
  echo "⚠️  ImageMagick غير مثبت. يرجى تثبيته:"
  echo "   Ubuntu/Debian: sudo apt-get install imagemagick"
  echo "   macOS: brew install imagemagick"
  echo "   Windows: https://imagemagick.org/script/download.php"
  exit 1
fi

generate_icons() {
  local svg_file=$1
  local output_dir=$2
  local app_name=$3
  
  echo ""
  echo "📱 توليد أيقونات: $app_name"
  
  mkdir -p "$output_dir"
  
  # تحويل SVG إلى PNG بأحجام مختلفة
  convert -background none "$svg_file" -resize 96x96 "$output_dir/${app_name}-96.png"
  convert -background none "$svg_file" -resize 192x192 "$output_dir/${app_name}-192.png"
  convert -background none "$svg_file" -resize 512x512 "$output_dir/${app_name}-512.png"
  
  echo "✅ تم توليد الأيقونات في: $output_dir"
}

# توليد أيقونات لكل تطبيق
generate_icons "admin-app/icon.svg" "../public/icons" "admin"
generate_icons "merchant-app/icon.svg" "../public/icons" "merchant"
generate_icons "client-app/icon.svg" "../public/icons" "client"

echo ""
echo "🎉 تم توليد جميع الأيقونات!"
echo " الموقع: ../public/icons/"
