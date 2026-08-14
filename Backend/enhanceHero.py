"""Prepare hero images: crop to 16:9, upscale, sharpen for full-screen display."""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HERO_DIR = ROOT / "Frontend" / "public" / "hero"
TARGET_W = 1920
TARGET_H = 1080

SOURCES = [
    ("hero-src-1.jpg", 0.5),
    ("hero-src-2.jpg", 0.45),
    ("hero-src-3.jpg", 0.4),
]

OUTPUT_NAMES = ["hero-1.jpg", "hero-2.jpg", "hero-3.jpg"]


def crop_16_9(img: Image.Image, focus_y: float) -> Image.Image:
    w, h = img.size
    target_ratio = 16 / 9
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        new_h = int(w / target_ratio)
        top = int((h - new_h) * focus_y)
        top = max(0, min(top, h - new_h))
        box = (0, top, w, top + new_h)

    return img.crop(box)


def enhance(img: Image.Image, focus_y: float = 0.35) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    img = crop_16_9(img, focus_y=focus_y)
    img = img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    img = ImageEnhance.Color(img).enhance(1.05)
    img = ImageEnhance.Brightness(img).enhance(1.03)
    img = ImageEnhance.Sharpness(img).enhance(1.25)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=80, threshold=3))
    return img


def main():
    HERO_DIR.mkdir(parents=True, exist_ok=True)
    for (name, focus_y), out_name in zip(SOURCES, OUTPUT_NAMES):
        src = HERO_DIR / name
        if not src.exists():
            print(f"Skip missing {name}")
            continue
        enhanced = enhance(Image.open(src).convert("RGB"), focus_y)
        dest = HERO_DIR / out_name
        enhanced.save(dest, "JPEG", quality=93, optimize=True, progressive=True)
        print(f"{name} -> {out_name} ({enhanced.size}, {dest.stat().st_size // 1024}KB)")


if __name__ == "__main__":
    main()
