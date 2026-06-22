
import * as crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * Create manifest signatures
 * @param {string} outDir 
 * @param {{ addHashComment?: boolean; createSignatureFiles?: boolean; generateManifest?: boolean; integrityAlgo?: 'sha256' | 'sha512' | 'md5'; }} options 
 * @returns Manifest signatures
 */
export async function processOutputFiles(outDir = '', options) {
  /** @type {Record<string, string>} */
  const signatures = {};
  
  /**
   * Walk
   * @param {string} dir 
   */
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && /\.(js|cjs|mjs|map)$/.test(entry.name)) {
        let content = await fs.readFile(fullPath, 'utf-8');
        const hash = crypto.createHash(options.integrityAlgo || 'sha256')
          .update(content)
          .digest('hex');

          // Normalize Windows backslashes to forward slashes
        let relativePath = path.relative(outDir, fullPath);
        // Convert Windows path separators to POSIX
        relativePath = relativePath.replace(/\\/g, '/');
        
        signatures[relativePath] = hash;
        
        if (options.addHashComment && entry.name.endsWith('.js')) {
          const hashLine = `// @hash ${hash}\n`;
          if (!content.startsWith('// @hash')) {
            content = hashLine + content;
            await fs.writeFile(fullPath, content);
            // Recalculate hash with the comment included
            const newHash = crypto.createHash(options.integrityAlgo || 'sha256')
              .update(content)
              .digest('hex');
            signatures[relativePath] = newHash; // Use new hash
          }
        }
        
        if (options.createSignatureFiles) {
          await fs.writeFile(fullPath + '.sig', hash);
        }
        
        console.log(`✓ Signed: ${path.relative(process.cwd(), fullPath)} (${hash.slice(0, 8)}...)`);
      }
    }
  }
  
  await walk(outDir);
  
  if (options.generateManifest) {
    const manifestPath = path.join(outDir, 'integrity.manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      algorithm: options.integrityAlgo || 'sha256',
      files: signatures
    }, null, 2));
    console.log(`✓ Manifest created: ${manifestPath}`);
  }
  
  return signatures;
}

async function generateAllManifests() {
  console.log('📦 Generating integrity manifests...');
  
  await processOutputFiles('dist/esm', {
    addHashComment: true,
    createSignatureFiles: true,
    generateManifest: true,
    integrityAlgo: 'sha256'
  });
  
  await processOutputFiles('dist/esm/min', {
    addHashComment: true,
    createSignatureFiles: true,
    generateManifest: true,
    integrityAlgo: 'sha256'
  });
  
  await processOutputFiles('dist/cjs', {
    addHashComment: true,
    createSignatureFiles: true,
    generateManifest: true,
    integrityAlgo: 'sha256'
  });
  
  await processOutputFiles('dist/cjs/min', {
    addHashComment: true,
    createSignatureFiles: true,
    generateManifest: true,
    integrityAlgo: 'sha256'
  });
  
  console.log('✅ All manifests generated!');
}

generateAllManifests();