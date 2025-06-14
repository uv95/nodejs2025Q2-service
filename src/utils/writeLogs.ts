import { access, appendFile, mkdir, readdir, stat } from 'node:fs/promises';
import { EOL } from 'node:os';
import { join } from 'node:path';

const BYTES_IN_KB = 1024;
const LOG_FILE_MAX_SIZE = +process.env.LOG_FILE_MAX_SIZE || 100;

export async function writeLogs(log: string) {
  const logDir = join(process.cwd(), 'src', 'logs');

  try {
    if (!(await pathExists(logDir))) {
      await mkdir(logDir, { recursive: true });
    }

    let fileNum = await getMaxFileNum(logDir);
    let logPath = join(logDir, getLogFileName(fileNum));

    const fileSize = await getFileSize(logPath);

    if (fileSize >= LOG_FILE_MAX_SIZE) {
      fileNum++;
      logPath = join(logDir, getLogFileName(fileNum));
    }

    await appendFile(logPath, log + EOL, 'utf-8');
  } catch (error) {
    console.error('Error writing log:', error);
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function getFileSize(path: string): Promise<number> {
  try {
    const fileStats = await stat(path);
    return fileStats.size / BYTES_IN_KB;
  } catch (error) {
    return 0;
  }
}

async function getMaxFileNum(dir: string) {
  try {
    const files = await readdir(dir);

    const nums = files.map((file) => {
      const match = file.match(/^logs-(\d+)\.txt$/);
      return match ? Number(match[1]) : 0;
    });

    return nums.length ? Math.max(...nums) : 0;
  } catch (error) {
    console.error('Error reading files in the directory:', error);
  }
}

function getLogFileName(fileNum: number): string {
  return `logs-${fileNum}.txt`;
}
