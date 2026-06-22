import crypto from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the package root (where node_modules/axera-fca is)
const packageRoot = join(__dirname, '..');

let valid = true;

const esmPath = join(packageRoot, 'dist/esm');
const cjsPath = join(packageRoot, 'dist/cjs');

// Check if manifest exists
const esmManifestPath = join(esmPath, 'integrity.manifest.json');
const cjsManifestPath = join(cjsPath, 'integrity.manifest.json');

try {
  const ESM_Manifest = JSON.parse(readFileSync(esmManifestPath, 'utf-8'));
  const CJS_Manifest = JSON.parse(readFileSync(cjsManifestPath, 'utf-8'));
  
  console.log('🔍 Verifying Axera FCA integrity...');
  
  // Check ESM files
  for (const [file, expectedHash] of Object.entries(ESM_Manifest.files)) {
    const filePath = join(esmPath, file);
    try {
      const content = readFileSync(filePath);
      const actualHash = crypto.createHash('sha256').update(content).digest('hex');
      if (actualHash !== expectedHash) {
        console.error(`❌ Integrity mismatch: ${file}`);
        valid = false;
      }
    } catch (err) {
      console.error(`❌ Missing file: ${file}`);
      valid = false;
    }
  }
  
  // Check CJS files
  for (const [file, expectedHash] of Object.entries(CJS_Manifest.files)) {
    const filePath = join(cjsPath, file);
    try {
      const content = readFileSync(filePath);
      const actualHash = crypto.createHash('sha256').update(content).digest('hex');
      if (actualHash !== expectedHash) {
        console.error(`❌ Integrity mismatch: ${file}`);
        valid = false;
      }
    } catch (err) {
      console.error(`❌ Missing file: ${file}`);
      valid = false;
    }
  }
  
  if (valid) {
    console.log('✅ Axera FCA integrity check passed!');
    console.log('Thank you for using Axera FCA! Contact the team at axera-team@protonmail.com for any inquiries, collaborations, or contributions.')
    process.exit(0);
  } else {
    console.error('❌ Axera FCA integrity check failed! The package may be corrupted.');
    process.exit(1);
  }
  
} catch (err) {
  console.error('❌ Could not verify Axera FCA integrity:', err.message);
  process.exit(1);
}