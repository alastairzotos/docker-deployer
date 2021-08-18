export interface CommandController {
  run(...args: any[]): Promise<void>;
}

export type Commands = { [key: string]: CommandController };
