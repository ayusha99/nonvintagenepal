"""
Crop Instagram product screenshots — removes status bar, header, likes, caption, thumbnails.
Usage: python cropInstagramProducts.py [input_dir_or_file ...]
Outputs to Frontend/public/products/
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "Frontend" / "public" / "products"

# Fraction of height to remove from top (status bar + IG header) and bottom (actions + caption + thumbnails)
TOP_RATIO = 0.14
BOTTOM_RATIO = 0.33

PRODUCTS = [
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8335-304b88f4-9e66-4220-95ca-df300b69c4a1.png",
        "output": "fox-racing-jersey.png",
    },
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8337-9114b6c5-6d0b-43f3-858a-f03f0627972c.png",
        "output": "leaf-camo-henley.png",
    },
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8334-b3e5db06-40c7-4362-9ed3-f38ccae8b4dd.png",
        "output": "pink-floyd-raglan.png",
    },
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8336-ae21024e-5ee3-451d-b704-b8842b2f055e.png",
        "output": "tree-bark-camo-longsleeve.png",
    },
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8333-6141ce90-d7b8-4952-bb02-61b2142d2bb7.png",
        "output": "bass-pro-shops-tee.png",
    },
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8338-12df4368-e8c7-421e-b276-1f78fdc07a68.png",
        "output": "stitch-aloha-hawaii-tee.png",
    },
    {
        "source": "c__Users_Aayusha_AppData_Roaming_Cursor_User_workspaceStorage_2c47aa8910ad12a71dc392a38eb73810_images_IMG_8328-b4dee659-2687-458e-929f-f6fea6525ee7.png",
        "output": "still-rolling-stones-tee.png",
    },
]

ASSETS_DIR = Path(
    r"C:\Users\Aayusha\.cursor\projects\c-Users-Aayusha-Desktop-nonvintagenepal\assets"
)


def crop_instagram_screenshot(img: Image.Image, top_ratio: float = TOP_RATIO, bottom_ratio: float = BOTTOM_RATIO) -> Image.Image:
    width, height = img.size
    top = int(height * top_ratio)
    bottom = int(height * (1 - bottom_ratio))
    return img.crop((0, top, width, bottom))


def crop_file(source: Path, dest: Path) -> dict:
    img = Image.open(source)
    cropped = crop_instagram_screenshot(img)
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dest, optimize=True)
    return {"source": str(source), "output": str(dest), "size": cropped.size}


def main() -> None:
    results = []
    for item in PRODUCTS:
        source = ASSETS_DIR / item["source"]
        dest = OUT_DIR / item["output"]
        if not source.exists():
            print(f"Missing: {source}", file=sys.stderr)
            sys.exit(1)
        info = crop_file(source, dest)
        print(f"Cropped {source.name} -> {dest.name} {info['size']}")
        results.append(info)

    manifest = OUT_DIR / "crop-manifest.json"
    manifest.write_text(json.dumps(results, indent=2))
    print(f"Saved manifest: {manifest}")


if __name__ == "__main__":
    main()
