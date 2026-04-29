#!/usr/bin/env python3
"""
Anahtarlık 3D Keychain Generator
=====================================================
CadQuery tabanlı düz ve damla formlu anahtarlık üretici.

Kullanım:
  python generator_cq.py --text ANAHTARLIK --base_shape teardrop --hole_position center_left
"""

import cadquery as cq
import argparse
import sys
import math

# ============================================================
# CLI ARGÜMANLARI
# ============================================================

parser = argparse.ArgumentParser(description="3D Anahtarlık Üretici")
parser.add_argument("--text",          type=str,   default="TA4TUN",   help="Anahtarlık metni")
parser.add_argument("--font_size",     type=float, default=30.0,       help="Yazı boyutu (mm)")
parser.add_argument("--base_shape",    type=str,   default="rectangle",help="Taban şekli: rectangle veya teardrop")
parser.add_argument("--hole_position", type=str,   default="center_left", help="Delik konumu")
parser.add_argument("--base_height",   type=float, default=3.0,        help="Taban plakası yüksekliği (mm)")
parser.add_argument("--chamfer",       type=float, default=1.0,        help="Taban üst kenar pah kırma (mm)")
parser.add_argument("--font",          type=str,   default="Arial",    help="Font adı")
parser.add_argument("--output",        type=str,   default="keychain.stl", help="Çıktı dosyası")
args = parser.parse_args()

# ============================================================
# PARAMETRELER
# ============================================================

metin           = args.text
yazi_boyutu     = args.font_size
base_shape_type = args.base_shape
hole_pos        = args.hole_position
taban_yukseklik = args.base_height
pah_miktari     = args.chamfer
font_adi        = args.font
output_file     = args.output

yazi_kalinlik   = 2.5
hole_radius     = 3.5

approx_text_width = len(metin) * yazi_boyutu * 0.65
approx_text_depth = yazi_boyutu

is_left = 'left' in hole_pos
is_right = 'right' in hole_pos

p_left = 24.0 if is_left else 10.0
p_right = 24.0 if is_right else 10.0
p_top = 10.0
p_bottom = 10.0

approx_width = approx_text_width + p_left + p_right
approx_depth = approx_text_depth + p_top + p_bottom

if base_shape_type == "teardrop":
    approx_width += 10.0 # Damla şekli için ekstra padding

base_center_x = (p_right - p_left) / 2

# ============================================================
# 1. TABAN PLAKASI (Base Plate)
# ============================================================

if base_shape_type == "teardrop":
    r_main = approx_depth / 2
    r_small = hole_radius + 4.5
    
    cx_left = -approx_width / 2 + (r_small if is_left else r_main)
    cx_right = approx_width / 2 - (r_main if is_left else r_small)
    
    r_left = r_small if is_left else r_main
    r_right = r_main if is_left else r_small
    
    d = cx_right - cx_left
    theta = math.asin((r_left - r_right) / d)
    
    TL = (cx_left + r_left * math.sin(theta), r_left * math.cos(theta))
    BL = (cx_left + r_left * math.sin(theta), -r_left * math.cos(theta))
    TR = (cx_right + r_right * math.sin(theta), r_right * math.cos(theta))
    BR = (cx_right + r_right * math.sin(theta), -r_right * math.cos(theta))
    
    # İki silindir ve bir trapezoidi (teğet poligon) birleştir
    cyl_left = cq.Workplane("XY").center(cx_left, 0).cylinder(taban_yukseklik, r_left, centered=(True, True, False))
    cyl_right = cq.Workplane("XY").center(cx_right, 0).cylinder(taban_yukseklik, r_right, centered=(True, True, False))
    
    trapezoid = (
        cq.Workplane("XY")
        .polyline([TL, TR, BR, BL])
        .close()
        .extrude(taban_yukseklik)
    )
    
    base = cyl_left.union(cyl_right).union(trapezoid)
    
else:
    # Dikdörtgen
    base = (
        cq.Workplane("XY")
        .center(base_center_x, 0)
        .box(approx_width, approx_depth, taban_yukseklik, centered=(True, True, False))
    )
    try:
        base = base.edges("|Z").fillet(5)
    except:
        pass

# Pah (Chamfer)
safe_chamfer = min(pah_miktari, (taban_yukseklik / 2) - 0.1)
if safe_chamfer > 0.1:
    try:
        base = base.faces(">Z").edges().chamfer(safe_chamfer)
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

if base_shape_type == "teardrop":
    hole_y = 0
else:
    if 'top' in hole_pos:
        hole_y = approx_depth/2 - hole_radius - 4.5
    elif 'bottom' in hole_pos:
        hole_y = -approx_depth/2 + hole_radius + 4.5
    else:
        hole_y = 0

try:
    # Deliği taban modeli üzerinde çıkart (cut)
    # hole() metodu sadece objenin üzerinde bir workplane varsa kolay çalışır,
    # Alternatif olarak yeni bir silindir oluşturup çıkaralım:
    hole_cyl = cq.Workplane("XY").center(hole_x + base_center_x, hole_y).cylinder(taban_yukseklik * 3, hole_radius, centered=(True, True, True))
    base = base.cut(hole_cyl)
except Exception as e:
    print(f"[WARN] Delik açılamadı: {e}")

# ============================================================
# 3. METİN PROFİLİ
# ============================================================

try:
    text_3d = (
        cq.Workplane("XY")
        .translate((0, 0, taban_yukseklik)) # Tabanın üstünden başlat
        .text(metin, yazi_boyutu, yazi_kalinlik, font=font_adi, kind="bold", halign="center", valign="center")
    )
except Exception as e:
    print(f"[ERROR] Yazı oluşturulamadı: {e}")
    sys.exit(1)

# ============================================================
# 4. BİRLEŞTİRME & EXPORT
# ============================================================

try:
    final_model = base.union(text_3d)
except Exception as e:
    final_model = cq.Assembly()
    final_model.add(base)
    final_model.add(text_3d)

try:
    cq.exporters.export(final_model, output_file)
    print(f"\n{'='*50}")
    print(f"  ✅ Anahtarlık başarıyla oluşturuldu: {output_file}")
    print(f"  🔲 Şekil: {base_shape_type.upper()}")
    print(f"  🕳️ Delik Konumu: {hole_pos}")
    print(f"{'='*50}\n")
except Exception as e:
    print(f"[FATAL] STL export başarısız: {e}")
    sys.exit(1)
