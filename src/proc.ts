import * as child_process from 'child_process';

export const spawnProcess = async (command: string, args: string[], logs: string[]): Promise<void> =>
  new Promise((resolve, reject) => {
    const proc = child_process.spawn(command, args, { shell: true });

    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr);

    if (logs) {
      proc.stdout.on('data', data => logs.push(data.toString()));
      proc.stderr.on('data', data => logs.push(data.toString()));
    }

    proc.on('exit', () => resolve());
    proc.on('error', error => reject(error));
  });
