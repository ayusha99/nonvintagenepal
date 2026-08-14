from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "Frontend" / "public" / "drops"
OUT = ROOT / "items"

DROPS = [
    ("full-sleeve-drop-1.png", "drop-1"),
    ("full-sleeve-drop-2.png", "drop-2"),
    ("vintage-jersey-drop.png", "drop-3"),
]

# Top portion of each collage (exclude bottom branding text)
GRID_HEIGHT_RATIO = 0.78
COLS = 3
ROWS = 3


def crop_grid(source: Path, out_dir: Path) -> list[str]:
    img = Image.open(source)
    width, height = img.size
    grid_height = int(height * GRID_HEIGHT_RATIO)
    grid = img.crop((0, 0, width, grid_height))

    cell_w = width // COLS
    cell_h = grid_height // ROWS
    out_dir.mkdir(parents=True, exist_ok=True)

    paths = []
    index = 1
    for row in range(ROWS):
        for col in range(COLS):
            left = col * cell_w
            top = row * cell_h
            right = left + cell_w if col < COLS - 1 else width
            bottom = top + cell_h if row < ROWS - 1 else grid_height
            tile = grid.crop((left, top, right, bottom))
            filename = f"{index:02d}.png"
            dest = out_dir / filename
            tile.save(dest, optimize=True)
            paths.append(f"/drops/items/{out_dir.name}/{filename}")
            index += 1
    return paths


def main():
    all_paths = {}
    for source_name, folder in DROPS:
        paths = crop_grid(ROOT / source_name, OUT / folder)
        all_paths[folder] = paths
        print(f"{source_name} -> {len(paths)} tiles in items/{folder}/")

    for folder, paths in all_paths.items():
        print(folder)
        for p in paths:
            print(" ", p)


if __name__ == "__main__":
    main()
