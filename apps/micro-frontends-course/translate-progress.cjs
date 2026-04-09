#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const exercisesDir = '/Users/user/projects/courses/apps/micro-frontends-course/src/exercises';

// Get all subdirectories
const subdirs = fs.readdirSync(exercisesDir).filter(d =>
  fs.statSync(path.join(exercisesDir, d)).isDirectory()
);

// List all .md files that don't have .en.md versions yet
const filesToTranslate = [];
for (const subdir of subdirs) {
  const dirPath = path.join(exercisesDir, subdir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') && !f.endsWith('.en.md'));
  for (const file of files) {
    const enFile = file.replace('.md', '.en.md');
    const enFilePath = path.join(dirPath, enFile);
    if (!fs.existsSync(enFilePath)) {
      filesToTranslate.push(`${subdir}/${file}`);
    }
  }
}

console.log(`Files remaining to translate: ${filesToTranslate.length}`);
filesToTranslate.forEach(f => console.log(`  ${f}`));
