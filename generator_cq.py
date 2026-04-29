#!/usr/bin/env python3
"""
Anahtarlık 3D Keychain Generator
=====================================================
CadQuery tabanlı düz anahtarlık üretici.
Metin düz bir tabana ekstrüzyon ile eklenir ve
kullanıcının seçtiği konuma bir anahtarlık deliği açılır.

Kullanım:
  python generator_cq.py --text ANAHTARLIK --hole_position top_left --base_height 3

Gereksinimler:
  pip install cadquery
"""

import cadquery as cq
import argparse
import sys
import math

# ============================================================
# CLI ARGÜMANLARI
# ============================================================

parser = argparse.ArgumentParser(description="3D Düz Anahtarlık Üretici")
parser.add_argument("--text",          type=str,   default="TA4TUN",   help="Anahtarlık metni")
parser.add_argument("--font_size",     type=float, default=30.0,       help="Yazı boyutu (mm)")
parser.add_argument("--hole_position", type=str,   default="top_left", help="Delik konumu (top_left, center_left vb.)")
parser.add_argument("--base_height",   type=float, default=3.0,        help="Taban plakası yüksekliği (mm)")
parser.add_argument("--chamfer",       type=float, default=1.0,        help="Taban üst kenar pah kırma (mm)")
parser.add_argument("--font",          type=str,   default="Arial",    help="Font adı (sistem fontları)")
parser.add_argument("--output",        type=str,   default="keychain.stl", help="Çıktı dosyası")
args = parser.parse_args()

# ============================================================
# PARAMETRELER
# ============================================================

metin           = args.text
yazi_boyutu     = args.font_size
hole_pos        = args.hole_position
taban_yukseklik = args.base_height
pah_miktari     = args.chamfer
font_adi        = args.font
output_file     = args.output

yazi_kalinlik   = 2.5 # Yazı yüksekliği (Z)
hole_radius     = 3.5 # Anahtarlık deliği yarıçapı

# Metnin yaklaşık genişliğini hesapla
# Arial için ortalama oran
approx_text_width = len(metin) * yazi_boyutu * 0.65
approx_text_depth = yazi_boyutu

# Padding hesaplama
is_left = 'left' in hole_pos
is_right = 'right' in hole_pos

p_left = 24.0 if is_left else 10.0
p_right = 24.0 if is_right else 10.0
p_top = 10.0
p_bottom = 10.0

approx_width = approx_text_width + p_left + p_right
approx_depth = approx_text_depth + p_top + p_bottom

print(f"[BASE] Taban boyutları: {approx_width:.1f} x {approx_depth:.1f} x {taban_yukseklik:.1f} mm")

# ============================================================
# 1. TABAN PLAKASI
# ============================================================

# Taban merkezini text'e göre hizalamak için X kaydırması
base_center_x = (p_right - p_left) / 2

base = (
    cq.Workplane("XY")
    .center(base_center_x, 0)
    .box(approx_width, approx_depth, taban_yukseklik)
)

# Alt ve yan köşelere yumuşatma
try:
    base = base.edges("|Z").fillet(5) # Köşeleri yuvarlat
except Exception as e:
    print(f"[WARN] Fillet uygulanamadı: {e}")

# Üst kenarlara Chamfer
safe_chamfer = min(pah_miktari, (taban_yukseklik / 2) - 0.1)
if safe_chamfer > 0.1:
    try:
        base = base.faces(">Z").edges().chamfer(safe_chamfer)
        print(f"[BASE] Üst kenarlara {safe_chamfer:.1f}mm chamfer uygulandı ✓")
    except:
        pass

# ============================================================
# 2. DELİK AÇMA (HOLE)
# ============================================================

hole_x = 0
hole_y = 0

if is_left:
    hole_x = -approx_width/2 + hole_radius + 4.5
elif is_right:
    hole_x = approx_width/2 - hole_radius - 4.5

if 'top' in hole_pos:
    hole_y = approx_depth/2 - hole_radius - 4.5
elif 'bottom' in hole_pos:
    hole_y = -approx_depth/2 + hole_radius + 4.5
else:
    hole_y = 0

print(f"[HOLE] Konum: {hole_pos}, Koordinatlar: X:{hole_x:.1f}, Y:{hole_y:.1f}")

# Tabanı deliği kesecek şekilde güncelle
try:
    # Delik için silindir oluştur
    # Dikkat: hole_x ve hole_y taban merkezine göredir,
    # Taban merkezi (base_center_x, 0) konumunda.
    # Bu nedenle deliğin Workplane merkezi de base_center_x kadar kaymalı.
    base = (
        base.faces(">Z")
        .workplane(centerOption="ProjectedOrigin")
        .center(hole_x, hole_y)
        .hole(hole_radius * 2) # hole argümanı çaptır
    )
    print(f"[HOLE] Delik başarıyla açıldı ✓")
except Exception as e:
    print(f"[WARN] Delik açılamadı: {e}")


# ============================================================
# 3. METİN PROFİLİ OLUŞTURMA
# ============================================================

print("[TEXT] Yazı extrude ediliyor...")
try:
    # Yazı XY düzleminde, tabanın üstünden başlar
    text_3d = (
        cq.Workplane("XY")
        .translate((0, 0, taban_yukseklik / 2))
        .text(metin, yazi_boyutu, yazi_kalinlik, font=font_adi, kind="bold", halign="center", valign="center")
    )
    print("[TEXT] Yazı başarıyla oluşturuldu ✓")
except Exception as e:
    print(f"[ERROR] Yazı oluşturulamadı: {e}")
    sys.exit(1)

# ============================================================
# 4. BİRLEŞTİRME & EXPORT
# ============================================================

try:
    final_model = base.union(text_3d)
    print("[UNION] Taban + Yazı birleştirildi ✓")
except Exception as e:
    print(f"[WARN] Union başarısız, ayrı compound olarak kaydediliyor: {e}")
    final_model = cq.Assembly()
    final_model.add(base)
    final_model.add(text_3d)

# STL olarak kaydet
try:
    cq.exporters.export(final_model, output_file)
    print(f"\n{'='*50}")
    print(f"  ✅ Anahtarlık başarıyla oluşturuldu: {output_file}")
    print(f"  📏 Taban Yükseklik: {taban_yukseklik}mm") 
    print(f"  🕳️ Delik Konumu: {hole_pos}")
    print(f"  🔤 Metin: {metin}")
    print(f"{'='*50}\n")
except Exception as e:
    print(f"[FATAL] STL export başarısız: {e}")
    sys.exit(1)
