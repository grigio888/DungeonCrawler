# Terrain cube — base prompts (ComfyUI)

Copy into `Illustrious_GGUF_Terrain_Cube_PixelArt.json`.

Workflow: `~/Documents/ComfyUI/user/default/workflows/` (repo: `comfyui/workflows/`).

Output: **64×64** PNG → `terrain/<folder>/sprites/tile.png`

## Style (terrain cube + pixel)

masterpiece, best quality, score_9, score_8_up, score_7_up, source_anime, pixel art, 16-bit, retro RPG, game asset sprite, (one isometric terrain block:1.5), (single object only:1.4), (solid cube:1.3), orthographic isometric view, top face and two side faces visible, simple geometry, (thick dark outline:1.2), centered, large in frame, plain white background, flat colors, hard edges, limited palette, ragnarok online field tile style, no scenery

## Negative (Base)

person, character, human, monster, creature, animal, insect, face, text, watermark, logo, (grid:1.4), (tile map:1.3), (checkerboard:1.3), (border frame:1.4), (decorative border:1.3), (multiple blocks:1.5), (floating island:1.3), (hollow block:1.4), (cutaway:1.3), cross section, diorama, pedestal, platform, shadow blob, pink background, green frame, dotted line, map overlay, path, track, cobblestone, flowers, rocks, props, realistic, 3d render, photo, blurry, soft shading, gradient, dither noise, speckle texture

## Pipeline (do not reorder)

```
VAEDecode (768 latent) → Downscale 128 → Pixel quantize → Tile 64 → SaveImage
```

**Common mistake:** PixelArt on 1024 then scale to 768 — always downscale to **128** before quantize, then **64** for the game.

## Sampler defaults

| Setting | Value | Why |
| --- | --- | --- |
| Latent | 768×768 | Less room for grids / dioramas than 1024 |
| Steps | 36 | Simpler shapes need a bit more refinement |
| CFG | 5.5 | Lower = cleaner flat tiles; raise to 6.5 if too vague |
| Seed | `fixed` while tuning one terrain, then `randomize` |

## Pixel quantize

| Setting | Start | If too mushy | If too blocky |
| --- | --- | --- | --- |
| colors | 24 | 20 | 32 |
| pixel_size | 4 | 3 | 6 |

## Tuning by symptom

| You see… | Fix |
| --- | --- |
| Checkerboard / grid / map frame | Strengthen grid/border negatives; remove “tileable” / “seamless” from Style |
| Hollow top / cutaway / floating island | Add `(solid cube:1.3)`; negative “hollow”, “cutaway”, “floating island” |
| Ladybug, props, plants on top | Terrain-specific Negative; simplify Terrain prompt |
| Pink/green decorative background | Negative “pink background”, “green frame”, “border”; keep “white background” in Style |
| Two blocks or base plate | Negative “multiple blocks”, “pedestal”, “platform” |
| Noisy speckled top | Lower CFG; fewer material words in Terrain; lower `pixel_size` |
| Wrong material | Edit **Terrain** node only + **Negative (Terrain)** |

## Prompt rules

- **Style** = shape + camera + outline + background (same for all terrains).
- **Terrain** = material + colors only (~1–2 sentences).
- Do **not** use together: `top-down` + `isometric` + `voxel` + `tileable` + `seamless` (they fight and cause grids).
- Prefer **block** over “terrain cube” — Illustrious understands game blocks better.
