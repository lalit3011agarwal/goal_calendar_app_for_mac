# Goal Calendar App for Mac

A minimalist goal countdown wallpaper generator for macOS. Includes smart padding for lock screen time & password areas.

## Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create goal-calendar --public --push
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your `goal-calendar` repository
   - Click "Deploy"

3. **Done!** Your app will be live at `https://goal-calendar.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Usage

1. Visit your deployed app
2. Configure your goal (name, dates, theme, size)
3. Copy the image URL
4. Use the URL as your wallpaper source - it updates daily!

## API Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `goal` | Goal name | "My Goal" |
| `start_date` | Start date (YYYY-MM-DD) | Today |
| `goal_date` | Goal date (YYYY-MM-DD) | 3 months |
| `width` | Width in pixels | 3024 |
| `height` | Height in pixels | 1964 |
| `theme` | dark/light/midnight/forest/sunset | dark |
| `scale` | Size % (0.5 = 50%, 2.0 = 200%) | 1.0 |

## Files

```
├── api/goal.js      # Serverless function
├── index.html       # Wallpaper designer UI
├── package.json
├── vercel.json
└── README.md
```
