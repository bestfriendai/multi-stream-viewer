#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all TypeScript/TSX files with ESLint errors
const eslintOutput = execSync('npm run lint 2>&1 || true', { encoding: 'utf-8' });
const errorLines = eslintOutput.split('\n').filter(line => line.includes('Error:') || line.includes('Warning:'));

// Group errors by file
const errorsByFile = {};
let currentFile = null;

eslintOutput.split('\n').forEach(line => {
  if (line.startsWith('./src/')) {
    currentFile = line.trim();
    errorsByFile[currentFile] = [];
  } else if (currentFile && (line.includes('Error:') || line.includes('Warning:'))) {
    errorsByFile[currentFile].push(line.trim());
  }
});

console.log(`Found ${Object.keys(errorsByFile).length} files with ESLint issues`);

// Fix common issues
Object.entries(errorsByFile).forEach(([file, errors]) => {
  const filePath = file.replace('./', '');
  
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix unused imports
  errors.forEach(error => {
    if (error.includes('is defined but never used') && error.includes('import')) {
      const match = error.match(/(\d+):(\d+)\s+Error:\s+'(\w+)'/);
      if (match) {
        const [, lineNum, , varName] = match;
        const lines = content.split('\n');
        const lineIndex = parseInt(lineNum) - 1;
        
        if (lines[lineIndex]) {
          // Remove the unused import
          const importRegex = new RegExp(`\\b${varName}\\b,?\\s*`, 'g');
          lines[lineIndex] = lines[lineIndex].replace(importRegex, '');
          
          // Clean up empty imports
          lines[lineIndex] = lines[lineIndex]
            .replace(/,\s*,/g, ',')
            .replace(/{\s*,/g, '{')
            .replace(/,\s*}/g, '}')
            .replace(/{\s*}/g, '');
          
          // Remove line if import is now empty
          if (lines[lineIndex].match(/^import\s*{\s*}\s*from/)) {
            lines.splice(lineIndex, 1);
          }
          
          content = lines.join('\n');
          modified = true;
        }
      }
    }
    
    // Fix unescaped entities
    if (error.includes('can be escaped with')) {
      const match = error.match(/(\d+):(\d+)/);
      if (match) {
        const [, lineNum] = match;
        const lines = content.split('\n');
        const lineIndex = parseInt(lineNum) - 1;
        
        if (lines[lineIndex]) {
          lines[lineIndex] = lines[lineIndex]
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;');
          
          content = lines.join('\n');
          modified = true;
        }
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
});

console.log('ESLint fixes completed!');