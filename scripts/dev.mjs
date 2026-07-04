import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const rootDir = dirname(fileURLToPath(import.meta.url));
const projectDir = join(rootDir, '..');

const apps = [
  { name: 'backend', cwd: 'backend', args: ['run', 'dev'] },
  { name: 'frontend', cwd: 'frontend', args: ['run', 'dev'] }
];

const children = apps.map(({ name, cwd, args }) => {
  const child = spawn(npmCommand, args, {
    cwd: join(projectDir, cwd),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32'
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      stopAll();
      process.exit(code);
    }
  });

  return child;
});

function stopAll() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});