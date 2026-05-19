# Terrain cubes — ComfyUI

Generate **64×64** isometric terrain tiles for map composition (`TILE_SIZE_PX`).

## Workflow

| File | Use |
| --- | --- |
| `Illustrious_GGUF_Terrain_Cube_PixelArt.json` | One terrain type per run — grass, dirt, track, etc. |

Paths:

- Installed: `~/Documents/ComfyUI/user/default/workflows/`
- Repo copy: `comfyui/workflows/`

Same GGUF stack as items (`illustrious-q8_0.gguf`, dual CLIP, VAE, **PixelArtNode**).

**Pipeline order:** `Decode → 128px → Pixel quantize → 64px → Save`. Never quantize at 1024 or scale to 768 — see [`basePrompt.md`](./basePrompt.md).

## Steps

1. Load `Illustrious_GGUF_Terrain_Cube_PixelArt.json`.
2. **Style** / **Negative (Base)** — copy from [`basePrompt.md`](./basePrompt.md) (usually leave as-is).
3. **Terrain** — copy **Terrain** section from `002_grass/prompt.md` (or the folder you are authoring).
4. **Negative (Terrain)** — copy optional per-type negatives from the same `prompt.md`.
4. Queue. Output prefix: `terrain_cube_*`.
5. Pick the best frame, remove background if needed (white → transparent in Aseprite / GIMP).
6. Save as `sprites/tile.png` under that terrain folder (create `sprites/` if missing).

## Per terrain

| Folder | Role | Prompt file |
| --- | --- | --- |
| `001_common_ground` | Battle arena floor | `prompt.md` |
| `002_grass` | Compose border | `prompt.md` |
| `003_dirt` | Compose | `prompt.md` |
| `004_moss` | Compose | `prompt.md` |
| `005_gravel` | Compose | `prompt.md` |
| `006_track` | Paths to arena | `prompt.md` |

Debug map still uses `definition.color` until sprites are wired in the UI.
