# 8-direction sprites — ComfyUI img2img

## Why you got messy images

1. **Tiny reference (e.g. 40×33)** encoded directly → SDXL img2img breaks.  
   **Fix:** workflow now has **Upscale to 1024** before `VAEEncode`. Reload the workflow.
2. **Denoise too high (0.62)** → model repaints a new creature.  
   **Fix:** lowered per direction (S ≈ 0.28, sides ≈ 0.44–0.52).
3. **Wrong monster prompt** (e.g. poring text for a jelly image).

## Workflows

| File                                        | Use                                                                |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `Illustrious_GGUF_1Direction_Img2Img.json`  | **Start here** — one facing, tune denoise, then repeat for E, N, … |
| `Illustrious_GGUF_8Directions_Img2Img.json` | Batch all 8 after settings look good                               |

Path: `Documents/ComfyUI/user/default/workflows/`

## Steps

1. Load workflow (prefer **1Direction** first).
2. **LoadImage** → your south-facing sprite (any size).
3. **Monster** → must match the image (copy from `monsters/…/prompt.md`).
4. **Direction** → e.g. `facing east, right side profile`.
5. Queue. If still messy: lower **denoise** by 0.05; if still south-facing: raise by 0.05 (max ~0.55).
6. Repeat with new direction text (or use 8-direction workflow).

## Limits

img2img without IP-Adapter is imperfect for true RO 8-view rotation. Symmetric mobs work best. For heroes with gear, expect to fix some facings by hand or generate that angle from scratch in the monster workflow.
