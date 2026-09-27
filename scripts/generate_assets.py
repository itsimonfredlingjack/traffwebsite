import os
from PIL import Image, ImageDraw, ImageFont

def draw_traff_mark(draw, cx, cy, radius, emerald=(5, 150, 105)):
    """Draws the concentric target TraffMark icon."""
    # Outer circle
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=emerald, width=max(2, int(radius * 0.15)))
    # Inner center dot
    r_inner = radius * 0.4
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=emerald)

def create_og_image(output_path):
    width, height = 1200, 630
    img = Image.new('RGBA', (width, height), (239, 239, 235, 255))
    draw = ImageDraw.Draw(img)

    # Fonts
    serif_bold = '/usr/share/fonts/google-noto/NotoSerif-Regular.ttf'
    serif_italic = '/usr/share/fonts/google-noto-vf/NotoSerif-Italic[wght].ttf'
    sans_reg = '/usr/share/fonts/google-noto/NotoSans-Regular.ttf'
    sans_bold = '/usr/share/fonts/google-noto-vf/NotoSans[wght].ttf'
    mono = '/usr/share/fonts/adwaita-mono-fonts/AdwaitaMono-Bold.ttf'

    font_kicker = ImageFont.truetype(mono, 18)
    font_brand = ImageFont.truetype(serif_bold, 36)
    font_brand_tag = ImageFont.truetype(mono, 14)
    font_title = ImageFont.truetype(serif_bold, 64)
    font_title_italic = ImageFont.truetype(serif_italic, 64)
    font_lead = ImageFont.truetype(sans_reg, 24)
    font_refusal = ImageFont.truetype(sans_reg, 24)
    font_pill = ImageFont.truetype(mono, 16)
    font_domain = ImageFont.truetype(mono, 18)

    # Ambient drop shadow for the card
    shadow_offset = 12
    draw.rounded_rectangle(
        [60, 50 + shadow_offset, 1140, 580 + shadow_offset],
        radius=28,
        fill=(220, 220, 214, 255)
    )

    # Main Card
    draw.rounded_rectangle(
        [60, 50, 1140, 580],
        radius=28,
        fill=(255, 255, 255, 255),
        outline=(225, 225, 220, 255),
        width=2
    )

    # Card interior content
    # 1. Top row: Logo + Brand + Kicker
    draw_traff_mark(draw, 120, 110, 20)
    draw.text((155, 90), 'Träff', font=font_brand, fill=(15, 17, 21))
    draw.text((250, 105), 'DOKUMENT-AI', font=font_brand_tag, fill=(120, 120, 125))

    # Kicker pill on right
    draw.rounded_rectangle([720, 92, 1080, 128], radius=18, fill=(243, 241, 236), outline=(225, 225, 220), width=1)
    draw.text((740, 101), 'SVENSK AI FÖR DOKUMENT OCH BELÄGG', font=font_kicker, fill=(70, 75, 85))

    # Divider line
    draw.line([100, 160, 1100, 160], fill=(240, 240, 235), width=2)

    # 2. Hero Headline
    draw.text((100, 195), 'Fråga dina dokument.', font=font_title, fill=(15, 17, 21))
    draw.text((100, 275), 'Se svaren på sidan.', font=font_title_italic, fill=(80, 85, 95))

    # 3. Subtext
    draw.text((100, 370), 'När svaret finns i dokumenten visar Träff exakt var.', font=font_lead, fill=(35, 40, 48))
    draw.text((100, 405), 'Finns det inte där säger Träff det. 100% källbunden med inringat bevis.', font=font_refusal, fill=(120, 125, 135))

    # 4. Bottom feature badges
    # Badge 1: BELAGT
    draw.rounded_rectangle([100, 475, 340, 525], radius=25, fill=(236, 253, 245), outline=(5, 150, 105), width=2)
    draw_traff_mark(draw, 130, 500, 10)
    draw.text((155, 490), 'BELAGT I KÄLLAN', font=font_pill, fill=(6, 95, 70))

    # Badge 2: EU-Datalagring
    draw.rounded_rectangle([360, 475, 660, 525], radius=25, fill=(247, 247, 245), outline=(220, 220, 215), width=1)
    draw.text((385, 490), 'EU-DATALAGRING · GDPR', font=font_pill, fill=(80, 85, 95))

    # Domain on right
    draw.rounded_rectangle([920, 475, 1080, 525], radius=25, fill=(17, 19, 23))
    draw.text((955, 490), 'traff.app', font=font_domain, fill=(255, 255, 255))

    rgb_img = img.convert('RGB')
    rgb_img.save(output_path, 'PNG', optimize=True)
    print(f'Saved OG image to {output_path}')

def create_apple_touch_icon(output_path):
    size = 180
    img = Image.new('RGBA', (size, size), (17, 19, 23, 255)) # Dark ink background #111317
    draw = ImageDraw.Draw(img)

    # Concentric rings in emerald
    cx, cy = size // 2, size // 2
    r_outer = 60
    r_inner = 25
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=(5, 150, 105), width=10)
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=(5, 150, 105))

    rgb_img = img.convert('RGB')
    rgb_img.save(output_path, 'PNG', optimize=True)
    print(f'Saved Apple Touch Icon to {output_path}')

if __name__ == '__main__':
    # Icons and the share image are rendered from the brand SVGs by
    # scripts/render-og.mjs. This file no longer paints the old ring.
    raise SystemExit('run: node scripts/render-og.mjs')
