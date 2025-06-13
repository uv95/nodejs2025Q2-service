import { access, appendFile, mkdir } from 'node:fs/promises';
import { EOL } from 'node:os';
import { join } from 'node:path';

export async function writeLogs(log: string) {
  try {
    const currentDir = process.cwd();
    const logDir = join(currentDir, 'src', 'log');
    const logPath = join(logDir, 'logs.txt');

    if (!(await pathExists(logDir))) {
      await mkdir(logDir, { recursive: true });
    }

    await appendFile(logPath, log + EOL, 'utf-8');
  } catch (error) {
    console.error('Error writing log:', error);
  }
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
}
