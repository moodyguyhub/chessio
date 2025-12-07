# Academy Visual Assets – Optimization Guide

This folder contains **original, unoptimized** images for the Academy visual integration.

## 📁 Expected Files (Drop Here)

Place your original high-res images in this folder:

- `cathedral-ceiling.jpg` - Cathedral vault with glowing chess ceiling
- `study-desk.jpg` - Single board, lamp, notebook, mug
- `staircase-ladder.jpg` - Chess pieces ascending carved staircase
- `grand-hall.jpg` - Grand wood-panelled chess hall

---

## 🖼️ Optimization Targets

**For web performance:**

| Type | Max Dimensions | Format | Quality |
|------|---------------|---------|---------|
| Hero / Full-bleed | 1920×1080 | .jpg | 70-80% |
| Section illustration | 1200×800 | .jpg | 70-80% |
| Thumbnails | 600×400 | .jpg | 70-80% |

---

## ⚡ Option A: CLI with ImageMagick

From project root:

```bash
# Install ImageMagick (if not already installed)
sudo apt-get install imagemagick

# Optimize each image
# Cathedral ceiling → Hero
convert assets_raw/academy/cathedral-ceiling.jpg \
  -resize 1920x1080\> -quality 78 \
  public/academy/academy-cathedral-hero.jpg

# Study desk → Section illustration
convert assets_raw/academy/study-desk.jpg \
  -resize 1600x1000\> -quality 78 \
  public/academy/academy-study-desk.jpg

# Staircase ladder → Hero/section
convert assets_raw/academy/staircase-ladder.jpg \
  -resize 1600x1600\> -quality 80 \
  public/academy/academy-ladder.jpg

# Grand hall → Hero/section
convert assets_raw/academy/grand-hall.jpg \
  -resize 1920x1080\> -quality 78 \
  public/academy/academy-grand-hall.jpg
```

---

## 🌐 Option B: Manual with Squoosh.app

1. Visit **https://squoosh.app**
2. Drag each image from `assets_raw/academy/`
3. Set:
   - Format: **MozJPEG**
   - Quality: **75-80**
   - Resize to target dimensions (see table above)
4. Download and save to `public/academy/` with these exact names:
   - `academy-cathedral-hero.jpg`
   - `academy-study-desk.jpg`
   - `academy-ladder.jpg`
   - `academy-grand-hall.jpg`

---

## ✅ Final File Structure

After optimization, `public/academy/` should contain:

```
public/academy/
├── academy-cathedral-hero.jpg   (1920×1080, ~200-400KB)
├── academy-study-desk.jpg       (1600×1000, ~150-300KB)
├── academy-ladder.jpg           (1600×1600, ~200-400KB)
└── academy-grand-hall.jpg       (1920×1080, ~200-400KB)
```

These filenames are **hardcoded in the app** - don't change them!

---

## 🚀 Next Step

Once images are optimized and in `public/academy/`, Vega can safely integrate them using Next.js `<Image>` component.
