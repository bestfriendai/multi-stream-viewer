#!/usr/bin/env node

/**
 * Streamyyy.com Asset Generator
 * Generates placeholder assets with correct dimensions for the rebrand
 * 
 * Usage: node scripts/generate-placeholder-assets.js
 * 
 * This script creates SVG-based placeholder assets that can be converted to PNG
 * or replaced with actual designed assets later.
 */

const fs = require('fs');
const path = require('path');

// Asset specifications
const assets = {
  'icon.png': {
    width: 1024,
    height: 1024,
    description: 'Main app icon'
  },
  'adaptive-icon.png': {
    width: 1024,
    height: 1024,
    description: 'Android adaptive icon foreground'
  },
  'favicon.png': {
    width: 192,
    height: 192,
    description: 'Web favicon'
  },
  'favicon-32x32.png': {
    width: 32,
    height: 32,
    description: 'Small favicon'
  },
  'favicon-16x16.png': {
    width: 16,
    height: 16,
    description: 'Tiny favicon'
  },
  'splash-icon.png': {
    width: 1284,
    height: 2778,
    description: 'Splash screen icon'
  }
};

// Brand colors
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#3b82f6',
  background: '#0a0a0a',
  white: '#ffffff'
};

/**
 * Generate SVG content for logo placeholder
 */
function generateLogoSVG(width, height, includeText = true) {
  const centerX = width / 2;
  const centerY = height / 2;
  const iconSize = Math.min(width, height) * 0.3;
  
  // For splash screen, adjust positioning
  const isSplash = height > width * 1.5;
  const logoY = isSplash ? centerY - height * 0.1 : centerY;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background (for splash screen) -->
  ${isSplash ? `<rect width="${width}" height="${height}" fill="${colors.background}"/>` : ''}
  
  <!-- Chat bubble background -->
  <rect x="${centerX - iconSize * 0.8}" y="${logoY - iconSize * 0.6}" 
        width="${iconSize * 1.6}" height="${iconSize * 1.2}" 
        rx="${iconSize * 0.2}" ry="${iconSize * 0.2}" 
        fill="url(#primaryGradient)"/>
  
  <!-- Play button triangle -->
  <polygon points="${centerX - iconSize * 0.2},${logoY - iconSize * 0.3} ${centerX - iconSize * 0.2},${logoY + iconSize * 0.3} ${centerX + iconSize * 0.3},${logoY}" 
           fill="${colors.white}"/>
  
  ${includeText && !isSplash ? `
  <!-- Streamyyy text -->
  <text x="${centerX}" y="${logoY + iconSize * 0.9}" 
        font-family="Arial, sans-serif" 
        font-size="${iconSize * 0.15}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="${colors.white}">Streamyyy</text>
  ` : ''}
  
  ${includeText && isSplash ? `
  <!-- Streamyyy.com text for splash -->
  <text x="${centerX}" y="${logoY + iconSize * 1.2}" 
        font-family="Arial, sans-serif" 
        font-size="${iconSize * 0.2}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="${colors.white}">Streamyyy.com</text>
  ` : ''}
</svg>`;
}

/**
 * Create assets directory if it doesn't exist
 */
function ensureAssetsDirectory() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  return assetsDir;
}

/**
 * Generate all placeholder assets
 */
function generateAssets() {
  const assetsDir = ensureAssetsDirectory();
  
  console.log('🎨 Generating Streamyyy.com placeholder assets...\n');
  
  Object.entries(assets).forEach(([filename, spec]) => {
    const { width, height, description } = spec;
    const isSplash = filename.includes('splash');
    const includeText = !filename.includes('favicon') && !filename.includes('adaptive');
    
    const svgContent = generateLogoSVG(width, height, includeText);
    const svgFilename = filename.replace('.png', '.svg');
    const svgPath = path.join(assetsDir, svgFilename);
    
    fs.writeFileSync(svgPath, svgContent);
    
    console.log(`✅ Generated ${svgFilename} (${width}x${height}) - ${description}`);
  });
  
  console.log('\n📝 Next steps:');
  console.log('1. Convert SVG files to PNG using your preferred tool');
  console.log('2. Replace with actual designed assets');
  console.log('3. Optimize file sizes for production');
  console.log('\n💡 Recommended tools for SVG to PNG conversion:');
  console.log('- Online: https://convertio.co/svg-png/');
  console.log('- CLI: npm install -g svg2png-cli');
  console.log('- Design tools: Figma, Sketch, Adobe Illustrator');
}

// Run the generator
if (require.main === module) {
  generateAssets();
}

module.exports = { generateAssets, generateLogoSVG, assets, colors };
