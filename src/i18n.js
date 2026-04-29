import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  TR: {
    translation: {
      "title": "SAKRAD 3 BOYUTLU ANAHTARLIK ÜRETİCİ",
      "settings_title": "Oluşturucu Ayarları",
      "settings_desc": "3D yazdırılabilir anahtarlığınızı özelleştirin",
      "language": "Dil",
      "label_text": "Ana Metin",
      "sub_text": "Alt Metin (Opsiyonel)",
      "placeholder": "Örn: YONCALI",
      "placeholder_sub": "Örn: MOBİLYA",
      "hole_position": "Delik Konumu",
      "hole_top_left": "Üst Sol",
      "hole_center_left": "Orta Sol",
      "hole_bottom_left": "Alt Sol",
      "hole_top_right": "Üst Sağ",
      "hole_center_right": "Orta Sağ",
      "hole_bottom_right": "Alt Sağ",
      "base_shape": "Taban Şekli",
      "shape_rectangle": "Dikdörtgen",
      "shape_teardrop": "Damla",
      "text_mode": "Yazı Tipi (Mod)",
      "mode_emboss": "Çıkıntılı",
      "mode_engrave": "Gömülü",
      "text_depth": "Derinlik (mm)",
      "filament_color": "Filaman Rengi",
      "plate_thickness": "PLAKA KALINLIĞI",
      "tilt_angle": "EĞİM AÇISI",
      "export_btn": "STL DOSYASI OLARAK ÇIKAR",
      "tip": "İpucu: 30-40 derece arası bir eğim (geriye yatıklık), destek (support) kullanmadan kusursuz FDM baskıları almanızı sağlar.",
      "export_ready": "DIŞA AKTARIMA HAZIR",
      "orbit_mode": "Yörünge Modu",
      "developer": "Geliştirici",
      "alignment_settings": "KONUM AYARLARI",
      "auto_center": "Otomatik Ortala",
      "text_position": "Metin Konumu",
      "arc_radius": "KAVİS YARIÇAPI (R)",
      "base_height": "TABAN YÜKSEKLİĞİ",
      "label_text_color": "Yazı Rengi",
      "label_base_color": "Taban Plakası Rengi",
      "fixed_length": "Sabit Genişlik",
      "width_cm": "cm",
      "auto": "OTO",
      "auto_length_tooltip": "Harf sayısına göre otomatik uzunluk",
      "text_scale": "Yazı Boyutu (%)",
      "export_single": "Tek Parça STL İndir",
      "export_multi": "Çift Renk (AMS) STL İndir",
      "ams_tip_title": "Çoklu Renk (AMS) Baskı",
      "ams_tip": "İndirdiğiniz ZIP dosyasındaki iki parçayı Bambu Studio'ya aynı anda sürükleyin. 'Tek obje olarak yüklensin mi?' sorusuna EVET deyin. Sol taraftaki Objeler (Objects) panelinden parçalara sağ tıklayıp farklı renk (flament) atayabilirsiniz.",
      "ignore_cantilever": "⚠️ Not: Bambu Studio'da 'Yüzen konsol var' (Floating cantilever) uyarısı alırsanız endişelenmeyin! Bu bir hata değildir; 'T' ve 'E' gibi yatay kollara sahip harflerin doğası gereği altının boş olmasından kaynaklanır. Uyarıyı yoksayıp basabilir veya dilerseniz 'Destek (Support)' açarak yazdırabilirsiniz."
    }
  },
  EN: {
    translation: {
      "title": "3D Keychain Generator",
      "settings_title": "Generator Settings",
      "settings_desc": "Customize your 3D printable keychain",
      "language": "Language",
      "label_text": "Main Text",
      "sub_text": "Sub Text (Optional)",
      "placeholder": "Ex: YONCALI",
      "placeholder_sub": "Ex: MOBİLYA",
      "hole_position": "Hole Position",
      "hole_top_left": "Top Left",
      "hole_center_left": "Center Left",
      "hole_bottom_left": "Bottom Left",
      "hole_top_right": "Top Right",
      "hole_center_right": "Center Right",
      "hole_bottom_right": "Bottom Right",
      "base_shape": "Base Shape",
      "shape_rectangle": "Rectangle",
      "shape_teardrop": "Teardrop",
      "text_mode": "Text Mode",
      "mode_emboss": "Emboss",
      "mode_engrave": "Engrave",
      "text_depth": "Text Depth (mm)",
      "filament_color": "Filament Color",
      "plate_thickness": "PLATE THICKNESS",
      "tilt_angle": "TILT ANGLE",
      "export_btn": "EXPORT AS STL",
      "tip": "Tip: A tilt angle between 30-40 degrees ensures flawless FDM prints without the need for supports.",
      "export_ready": "READY FOR EXPORT",
      "orbit_mode": "Orbit Mode",
      "developer": "Developer",
      "alignment_settings": "ALIGNMENT SETTINGS",
      "auto_center": "Auto-Center",
      "text_position": "Text Position",
      "arc_radius": "ARC RADIUS (R)",
      "base_height": "BASE HEIGHT",
      "label_text_color": "Text Color",
      "label_base_color": "Base Plate Color",
      "fixed_length": "Fixed Width",
      "width_cm": "cm",
      "auto": "AUTO",
      "auto_length_tooltip": "Automatic length based on letter count",
      "text_scale": "Text Scale (%)",
      "export_single": "Download Single Part STL",
      "export_multi": "Download Dual-Color (AMS) ZIP",
      "ams_tip_title": "Multi-Color (AMS) Printing",
      "ams_tip": "Drag both pieces from the downloaded ZIP into Bambu Studio simultaneously. Click YES when asked 'Load as single object?'. You can assign different colors by right-clicking parts in the Objects panel on the left.",
      "ignore_cantilever": "⚠️ Note: If Bambu Studio shows a 'Floating cantilever' warning, don't panic! It's not a bug; it's the natural geometry of letters with horizontal arms (like 'T' or 'E'). You can safely ignore the warning or enable supports if preferred."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "TR", 
    fallbackLng: "EN",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
