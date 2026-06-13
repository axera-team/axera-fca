import crypto from 'crypto';
import manifest from 'axera-fca/integrity.manifest.json';
import fs from 'fs';

let valid = true;
for (const [file, expectedHash] of Object.entries(manifest.files)) {
  const content = fs.readFileSync(`node_modules/axera-fca/${file}`);
  const actualHash = crypto.createHash('sha256').update(content).digest('hex');
  if (actualHash !== expectedHash) {
    console.error(`❌ Integrity mismatch: ${file}`);
    valid = false;
  }
}
process.exit(valid ? 0 : 1);