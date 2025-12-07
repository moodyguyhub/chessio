# Academy Visual Assets

This folder contains **web-optimized** images for the Academy visual integration.

## 📁 Expected Files

- `academy-cathedral-hero.jpg` (1920×1080) - Cathedral vault with glowing chess ceiling
- `academy-study-desk.jpg` (1600×1000) - Single board, lamp, notebook, mug
- `academy-ladder.jpg` (1600×1600) - Chess pieces ascending carved staircase
- `academy-grand-hall.jpg` (1920×1080) - Grand wood-panelled chess hall

## ⚠️ Important

These filenames are **hardcoded** in:
- `src/app/page.tsx` (Landing hero)
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/PathToMastery.tsx`
- `src/components/dashboard/ActiveDutyCard.tsx`
- `src/app/(protected)/app/page.tsx`

**Do not rename or move these files without updating the imports.**

## 🎨 Usage Guidelines

All images use Next.js `<Image>` component with:
- Proper `alt` text for accessibility
- `sizes` attribute for responsive loading
- Dark overlays (`bg-gradient-to-t from-black/80`) for text readability
- Lazy loading (except hero images with `priority`)

## 📊 Performance Targets

Target file sizes:
- Hero images: 200-400KB
- Section images: 150-300KB
- Thumbnails: 50-150KB

Check actual sizes after optimization:
```bash
ls -lh public/academy/
```
