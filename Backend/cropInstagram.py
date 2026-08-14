"""
Crop Instagram product screenshots and build product manifest.
Processes IMG_8317–IMG_8344 (one file per number; prefers known UUID when duplicated).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = Path(
    r"C:\Users\Aayusha\.cursor\projects\c-Users-Aayusha-Desktop-nonvintagenepal\assets"
)
OUT_DIR = ROOT / "Frontend" / "public" / "products"
MANIFEST_PATH = ROOT / "Backend" / "products-manifest.json"

TOP_RATIO = 0.14
BOTTOM_RATIO = 0.33
IMG_START = 8317
IMG_END = 8344

# When duplicate IMG numbers exist, prefer these UUID fragments
PREFERRED_UUID = {
    "8328": "b4dee659",
    "8333": "6141ce90",
    "8334": "b3e5db06",
    "8335": "304b88f4",
    "8336": "ae21024e",
    "8337": "9114b6c5",
    "8338": "12df4368",
}


def crop_instagram(img: Image.Image) -> Image.Image:
    w, h = img.size
    top = int(h * TOP_RATIO)
    bottom = int(h * (1 - BOTTOM_RATIO))
    return img.crop((0, top, w, bottom))


def discover_sources() -> list[tuple[str, Path]]:
    prefix = "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_"
    by_num: dict[str, list[Path]] = {}

    for path in ASSETS_DIR.glob(f"{prefix}83*.png"):
        match = re.search(r"IMG_(\d{4})-", path.name)
        if not match:
            continue
        num = match.group(1)
        if not (IMG_START <= int(num) <= IMG_END):
            continue
        by_num.setdefault(num, []).append(path)

    selected: list[tuple[str, Path]] = []
    for num in sorted(by_num, key=int):
        candidates = by_num[num]
        preferred = PREFERRED_UUID.get(num)
        chosen = None
        if preferred:
            for c in candidates:
                if preferred in c.name:
                    chosen = c
                    break
        if chosen is None:
            chosen = sorted(candidates, key=lambda p: p.name)[0]
        selected.append((num, chosen))
    return selected


def parse_overlay_text(text: str) -> dict:
    clean = text.upper().replace("₹", "").replace(",", "")
    size = re.search(r"SIZE\s*([XSML\d]+)", clean)
    chest = re.search(r"CHEST\s*(\d+)", clean)
    length = re.search(r"LENGTH\s*(\d+)", clean)
    price = re.search(r"PRICE\s*(\d+)", clean)
    return {
        "size": size.group(1) if size else None,
        "chest": int(chest.group(1)) if chest else None,
        "length": int(length.group(1)) if length else None,
        "price": int(price.group(1)) if price else None,
    }


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = discover_sources()
    manifest = []

    for num, source in sources:
        img = Image.open(source)
        cropped = crop_instagram(img)
        out_name = f"product-{num}.png"
        out_path = OUT_DIR / out_name
        cropped.save(out_path, optimize=True)

        # Parse overlay from top-left region of original screenshot
        w, h = img.size
        overlay = img.crop((0, int(h * 0.08), int(w * 0.55), int(h * 0.32)))
        overlay_path = OUT_DIR / f"_overlay-{num}.png"
        overlay.save(overlay_path)

        manifest.append(
            {
                "imgNum": num,
                "source": source.name,
                "image": f"/products/{out_name}",
                "overlayImage": f"/products/_overlay-{num}.png",
                "croppedSize": list(cropped.size),
            }
        )
        print(f"Cropped IMG_{num} -> {out_name}")

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
    print(f"\n{len(manifest)} images cropped -> {OUT_DIR}")
    print(f"Manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
