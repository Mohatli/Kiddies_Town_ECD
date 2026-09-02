/**
 * Dev script: Compiles server TypeScript with esbuild, then runs with plain Node.
 * 
 * This avoids tsx's ESM resolver bug (ERR_INVALID_URL_SCHEME) that occurs when
 * the project directory path contains spaces (e.g. "New folder").
 * tsx's resolveTsPaths incorrectly handles file:// URLs with encoded spaces.
 */
import { build } from 'esbuild';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function main() {
  console.log('⚡ Building server with esbuild...');

  await build({
    entryPoints: [path.join(ROOT, 'server/index.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    sourcemap: true,
    outfile: path.join(ROOT, '.tmp/server.mjs'),
    logLevel: 'warning',
    // Ensure tsx isn't resolved as an internal module
    external: ['vite', '@vitejs/plugin-react', '@tailwindcss/vite'],
  });

  console.log('✅ Server compiled → .tmp/server.mjs');
  console.log('🚀 Starting server with Node...\n');

  const child = spawn('node', [path.join(ROOT, '.tmp/server.mjs')], {
    stdio: 'inherit',
    cwd: ROOT,
    env: { ...process.env },
  });

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });

  // Forward signals
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

main().catch((err) => {
  console.error('❌ Dev script failed:', err);
  process.exit(1);
});
