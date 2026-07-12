"""Generate og-image.png and apple-touch-icon.png for nihaan-birthday-2026."""
from PIL import Image, ImageDraw, ImageFont
import os, sys

BASE = os.path.dirname(os.path.abspath(__file__))

# ─── helpers ─────────────────────────────────────────────────────────────────
def hex_rgba(h, a=255):
    h = h.lstrip('#')
    r, g, b = int(h[0:2],16), int(h[2:4],16), int(h[4:6],16)
    return (r, g, b, a)

RED    = hex_rgba('#DC2626')
INDIGO = hex_rgba('#1E1B4B')
WHITE  = hex_rgba('#FFFFFF')
CREAM  = hex_rgba('#FFFBF0')

def get_font(size, bold=False):
    candidates_bold = [
        'C:/Windows/Fonts/impactb.ttf',
        'C:/Windows/Fonts/impact.ttf',
        'C:/Windows/Fonts/ariblk.ttf',
        'C:/Windows/Fonts/arialbd.ttf',
    ]
    candidates_reg = [
        'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/calibri.ttf',
    ]
    paths = candidates_bold if bold else candidates_reg
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def draw_text_centered(draw, text, y, font, fill, img_width):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((img_width - w) // 2, y), text, font=font, fill=fill)

def draw_checkered_band(img, y, height, colors, count=46):
    draw = ImageDraw.Draw(img)
    sq_w = img.width / count
    for i in range(count):
        x0 = int(i * sq_w)
        x1 = int((i + 1) * sq_w)
        draw.rectangle([x0, y, x1, y + height], fill=colors[i % 2])


# ═══════════════════════════════════════════════════════════════════════════
#  1.  OG IMAGE  (1200 x 630)
# ═══════════════════════════════════════════════════════════════════════════
W, H = 1200, 630
BAND_H = 32

car_path = os.path.join(BASE, 'img', 'bugatti-chiron.jpg')
car_img  = Image.open(car_path).convert('RGBA')

# Crop to 1200x630 (centre-crop)
cw, ch = car_img.size
target_ratio = W / H
src_ratio    = cw / ch
if src_ratio > target_ratio:          # too wide — crop sides
    new_w = int(ch * target_ratio)
    offset = (cw - new_w) // 2
    car_img = car_img.crop((offset, 0, offset + new_w, ch))
else:                                  # too tall — crop top/bottom (keep upper area — car body)
    new_h = int(cw / target_ratio)
    offset = int(ch * 0.1)            # bias toward upper portion
    offset = min(offset, ch - new_h)
    car_img = car_img.crop((0, offset, cw, offset + new_h))

car_img = car_img.resize((W, H), Image.LANCZOS)

# Gradient overlay: strong on left, fade to right
overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw_ov = ImageDraw.Draw(overlay)
for x in range(W):
    # alpha: 245 at x=0, drops to 90 at x=W
    t = x / W
    a = int(245 - t * 150)
    draw_ov.line([(x, 0), (x, H)], fill=(30, 27, 75, a))

og = Image.alpha_composite(car_img, overlay)
draw = ImageDraw.Draw(og)

# Left red accent stripe
draw.rectangle([0, 0, 6, H], fill=RED)

# ── Typography ──────────────────────────────────────────────────────────────
f_name   = get_font(210, bold=True)   # "NIHAAN"
f_seven  = get_font(185, bold=True)   # "7"
f_label  = get_font(18,  bold=False)  # "IS TURNING"
f_badge  = get_font(13,  bold=True)   # badge text
f_detail = get_font(16,  bold=False)  # detail chips

PAD_L = 72   # left padding for all text

# Badge pill
badge_text = '    BIRTHDAY INVITATION   '
badge_bbox = draw.textbbox((0,0), '  BIRTHDAY INVITATION  ', font=f_badge)
bw = badge_bbox[2] - badge_bbox[0] + 40
bh = badge_bbox[3] - badge_bbox[1] + 18
draw.rounded_rectangle([PAD_L, 48, PAD_L + bw, 48 + bh], radius=bh//2,
                        fill=(255,255,255,22), outline=(255,255,255,40))
draw.text((PAD_L + 20, 48 + 9), 'BIRTHDAY INVITATION', font=f_badge,
          fill=(255, 255, 255, 178))

# "NIHAAN"
draw.text((PAD_L, 94), 'NIHAAN', font=f_name, fill=(255, 255, 255, 255))

# "is turning" label
label_y = 298
draw.text((PAD_L, label_y), 'IS TURNING', font=f_label, fill=(255, 255, 255, 115))

# "7"
lbl_bbox = draw.textbbox((PAD_L, label_y), 'IS TURNING', font=f_label)
seven_x = lbl_bbox[2] + 14
draw.text((seven_x, label_y - 118), '7', font=f_seven, fill=RED)

# Detail row near bottom
detail_y = H - BAND_H - 44
chips = ['Saturday 18 July 2026', '7:00 PM onwards', 'Tall Oaks, Bengaluru']
cx = PAD_L
for i, chip in enumerate(chips):
    if i > 0:
        draw.rectangle([cx, detail_y + 4, cx + 1, detail_y + 20],
                       fill=(255, 255, 255, 50))
        cx += 18
    # red dot
    draw.ellipse([cx, detail_y + 8, cx + 7, detail_y + 15], fill=RED)
    cx += 14
    draw.text((cx, detail_y), chip, font=f_detail, fill=(255, 251, 240, 178))
    bb = draw.textbbox((cx, detail_y), chip, font=f_detail)
    cx = bb[2] + 24

# Bugatti watermark (right side)
f_wm_brand = get_font(12, bold=True)
f_wm_name  = get_font(54, bold=True)
f_wm_stat  = get_font(14, bold=False)

wm_x = W - 68
wm_y = H - BAND_H - 130

def right_text(text, y, font, fill):
    bb = draw.textbbox((0, 0), text, font=font)
    w = bb[2] - bb[0]
    draw.text((wm_x - w, y), text, font=font, fill=fill)

right_text('BUGATTI', wm_y,        f_wm_brand, RED)
right_text('CHIRON',  wm_y + 16,   f_wm_name,  (255,255,255,210))
right_text('1,479 HP  ·  2.4s  ·  420 KM/H', wm_y + 74, f_wm_stat, (255,255,255,100))

# Checkered band at bottom
draw_checkered_band(og, H - BAND_H, BAND_H, [RED, CREAM])

og_path = os.path.join(BASE, 'og-image.png')
og.convert('RGB').save(og_path, 'PNG', optimize=True)
print(f'OG image saved: {og_path}  ({W}x{H})')


# ═══════════════════════════════════════════════════════════════════════════
#  2.  APPLE TOUCH ICON  (180 x 180)
# ═══════════════════════════════════════════════════════════════════════════
S = 180
ati = Image.new('RGBA', (S, S), (0, 0, 0, 0))
draw = ImageDraw.Draw(ati)

# Rounded rect background (indigo gradient simulation: just flat indigo)
from PIL import Image as PILImage
mask = PILImage.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S-1, S-1], radius=36, fill=255)

bg = PILImage.new('RGBA', (S, S), hex_rgba('#1E1B4B'))
ati = PILImage.composite(bg, PILImage.new('RGBA', (S, S), (0,0,0,0)), mask)
draw = ImageDraw.Draw(ati)

# Checkered accent (top-right)
sq = 16
for row in range(2):
    for col in range(2):
        color = RED if (row + col) % 2 == 0 else CREAM
        x0 = S - 8 - (2 - col) * sq
        y0 = 8 + row * sq
        draw.rectangle([x0, y0, x0 + sq - 1, y0 + sq - 1], fill=color)

# "7"
f7  = get_font(110, bold=True)
bb  = draw.textbbox((0, 0), '7', font=f7)
tw, th = bb[2] - bb[0], bb[3] - bb[1]
draw.text(((S - tw) // 2 - 4, 20), '7', font=f7, fill=RED)

# Car silhouette (simple polygon at bottom)
car_y  = 133
body_pts = [
    (8, 168), (8, 154), (14, 144), (24, 136), (44, 132),
    (68, 131), (88, 133), (100, 138), (116, 145), (128, 154),
    (134, 163), (136, 168)
]
draw.polygon(body_pts, fill=(255, 255, 255, 42))

# Wheel cutouts (indigo circles over body)
for cx_w in [32, 116]:
    draw.ellipse([cx_w-20, 152, cx_w+20, 192], fill=hex_rgba('#1E1B4B'))
    draw.ellipse([cx_w-13, 159, cx_w+13, 185], outline=(255,255,255,90), width=2)
    draw.ellipse([cx_w-4,  168, cx_w+4,  176], fill=(255,255,255,60))

ati_path = os.path.join(BASE, 'apple-touch-icon.png')
ati.save(ati_path, 'PNG')
print(f'Apple touch icon saved: {ati_path}  ({S}x{S})')
