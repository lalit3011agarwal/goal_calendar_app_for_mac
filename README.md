# 🎯 Goal Calendar Wallpaper for Mac

A beautiful, minimalist goal countdown wallpaper generator for macOS. Track your goals visually with an auto-updating wallpaper that shows your progress every day.

> 💻 Laptop version of [thelifecalendar.com](https://thelifecalendar.com/)

## ✨ Features

- **Visual Progress Tracking** — See your goal progress as a dot grid that fills up daily
- **Auto-Updating Wallpaper** — Set once, updates automatically every day
- **Lock Screen Optimized** — Smart padding for macOS time & password areas
- **5 Beautiful Themes** — Dark, Light, Midnight, Forest, Sunset
- **Fully Customizable** — Goal name, dates, colors, size, and more
- **High Resolution** — Retina-ready with quality scaling support

## 🖼️ How It Works

1. Configure your goal (name, start date, target date)
2. Choose a theme and customize the appearance
3. Generate a wallpaper URL
4. Set it as your Mac wallpaper — it updates daily!

## 🚀 Deploy Your Own

```bash
npm i -g vercel
vercel
vercel --prod
```

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| `dark` | Dark gray background with white dots |
| `light` | Clean white background with dark dots |
| `midnight` | Deep blue night theme |
| `forest` | Dark green nature-inspired |
| `sunset` | Warm dark red tones |

## ⚙️ API Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `goal` | Your goal name | "My Goal" |
| `start_date` | Start date (YYYY-MM-DD) | Today |
| `goal_date` | Target date (YYYY-MM-DD) | 3 months from now |
| `width` | Width in pixels | 3024 |
| `height` | Height in pixels | 1964 |
| `theme` | Color theme | dark |
| `scale` | Size multiplier (0.5–2.0) | 1.0 |
| `accent` | Accent color (hex) | Theme default |
| `top_padding` | Top safe zone (px) | 0 |
| `bottom_padding` | Bottom safe zone (px) | 0 |

## 📁 Project Structure

```
├── api/goal.js      # Serverless wallpaper generator
├── index.html       # Web UI for customization
├── vercel.json      # Vercel configuration
└── package.json
```

## 🛠️ Tech Stack

- **Runtime:** Node.js (Vercel Serverless Functions)
- **Canvas:** @napi-rs/canvas for high-quality image generation
- **Hosting:** Vercel

## 📝 License

MIT
