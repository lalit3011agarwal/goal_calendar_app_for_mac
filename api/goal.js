const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

// Register system font (Inter or fallback)
try {
    // Try to use bundled font if available
    const fontPath = path.join(__dirname, 'Inter-Medium.ttf');
    GlobalFonts.registerFromPath(fontPath, 'Inter');
} catch (e) {
    // Font registration failed, will use fallback
}

const themes = {
    dark: {
        bg: '#1a1a1a',
        text: '#9ca3af',
        textMuted: '#6b7280',
        cellFilled: '#ffffff',
        cellEmpty: '#4b5563',
        today: '#f97316'
    },
    light: {
        bg: '#fafafa',
        text: '#374151',
        textMuted: '#6b7280',
        cellFilled: '#1f2937',
        cellEmpty: '#d1d5db',
        today: '#f97316'
    },
    midnight: {
        bg: '#0f172a',
        text: '#94a3b8',
        textMuted: '#64748b',
        cellFilled: '#e2e8f0',
        cellEmpty: '#475569',
        today: '#f97316'
    },
    forest: {
        bg: '#0a0f0d',
        text: '#9ca3af',
        textMuted: '#6b7280',
        cellFilled: '#d1fae5',
        cellEmpty: '#374151',
        today: '#10b981'
    },
    sunset: {
        bg: '#1a0a0a',
        text: '#9ca3af',
        textMuted: '#6b7280',
        cellFilled: '#fecaca',
        cellEmpty: '#4b5563',
        today: '#f97316'
    }
};

function generateWallpaper(config) {
    const { goal, startDate, goalDate, width, height, theme: themeName, accent, topPadding, bottomPadding, scale } = config;
    
    // Scale up canvas resolution for higher quality when scale > 1
    const qualityScale = Math.max(1, scale);
    const canvasWidth = Math.round(width * qualityScale);
    const canvasHeight = Math.round(height * qualityScale);
    
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Scale context to match quality
    ctx.scale(qualityScale, qualityScale);
    
    const theme = themes[themeName] || themes.dark;
    const start = new Date(startDate);
    const end = new Date(goalDate);
    
    // Get current time in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const today = new Date(utcTime + istOffset);
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
    const progress = totalDays > 0 ? Math.round((daysPassed / totalDays) * 100) : 0;

    // Background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Calculate safe zone (excluding top and bottom padding for macOS lock screen)
    const safeTop = topPadding || 0;
    const safeBottom = bottomPadding || 0;
    const safeHeight = height - safeTop - safeBottom;
    const safeCenterY = safeTop + safeHeight / 2;

    // Grid layout: 30 columns for wider layout
    const cols = 30;
    const rows = Math.ceil(totalDays / cols);

    // Grid size with scale (default 1.0 = 25% of screen width)
    const baseGridWidth = width * 0.25;
    const gridWidth = baseGridWidth * scale;
    const gap = gridWidth / cols;
    const dotRadius = gap * 0.40;

    // Text sizes scale proportionally
    const titleSize = safeHeight * 0.04 * scale;
    const statsSize = safeHeight * 0.03 * scale;

    // Center the grid in the safe zone
    const actualGridWidth = cols * gap;
    const actualGridHeight = rows * gap;
    const gridLeft = (width - actualGridWidth) / 2 + gap / 2;
    const gridTop = safeCenterY - actualGridHeight / 2 + gap / 2;

    // Draw title (goal name) above the grid
    ctx.fillStyle = theme.text;
    ctx.font = `${titleSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(goal, width / 2, gridTop - gap * 2.5);

    // Draw dots with anti-aliasing (high quality circles)
    for (let i = 0; i < totalDays; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gridLeft + col * gap;
        const y = gridTop + row * gap;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

        if (i < daysPassed) {
            // Completed - filled white
            ctx.fillStyle = theme.cellFilled;
        } else if (i === daysPassed) {
            // Today - orange
            ctx.fillStyle = accent || theme.today;
        } else {
            // Remaining - gray/muted
            ctx.fillStyle = theme.cellEmpty;
        }
        ctx.fill();
    }

    // Draw bottom stats: "85d left · 65%"
    ctx.font = `${statsSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    
    // Same distance from dots as title (2.5 gaps)
    const statsY = gridTop + actualGridHeight - gap + gap * 2.5;
    const daysText = `${daysRemaining}d left`;
    const percentText = `${progress}%`;
    const combinedText = `${daysText}  ·  ${percentText}`;
    
    // Draw full text in muted color first
    ctx.fillStyle = theme.textMuted;
    ctx.fillText(combinedText, width / 2, statsY);
    
    // Redraw the accent part on top
    ctx.fillStyle = accent || theme.today;
    ctx.textAlign = 'left';
    const totalWidth = ctx.measureText(combinedText).width;
    ctx.fillText(daysText, width / 2 - totalWidth / 2, statsY);

    return canvas;
}

module.exports = async function handler(req, res) {
    const { query } = req;
    
    // Parse parameters
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const defaultGoal = new Date();
    defaultGoal.setMonth(defaultGoal.getMonth() + 3);

    // Default to MacBook Pro 14" lock screen dimensions with safe zones
    const config = {
        goal: query.goal || 'My Goal',
        startDate: query.start_date || todayStr,
        goalDate: query.goal_date || defaultGoal.toISOString().split('T')[0],
        width: parseInt(query.width) || 3024,
        height: parseInt(query.height) || 1964,
        theme: query.theme || 'dark',
        accent: query.accent ? '#' + query.accent : null,
        // macOS lock screen safe zones for MacBook Pro 14"
        topPadding: parseInt(query.top_padding) || 500,
        bottomPadding: parseInt(query.bottom_padding) || 400,
        // Scale: 1.0 = default, 0.5 = half size, 2.0 = double size
        scale: parseFloat(query.scale) || 1.0
    };

    // Limit size to prevent abuse
    config.width = Math.min(Math.max(config.width, 100), 5120);
    config.height = Math.min(Math.max(config.height, 100), 3840);

    try {
        const canvas = generateWallpaper(config);
        const buffer = canvas.toBuffer('image/png');

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.setHeader('Content-Disposition', `inline; filename="goal-wallpaper-${todayStr}.png"`);
        
        return res.send(buffer);
    } catch (error) {
        console.error('Error generating wallpaper:', error);
        res.status(500).json({ error: 'Error generating wallpaper', message: error.message });
    }
};
