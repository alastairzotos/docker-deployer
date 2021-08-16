export type Commands = { [key: string]: (...args: any[]) => Promise<any> };

export const cliName = 'mctrl';
export const pwdKey = 'PASSWORD_HASH';
export const secretKey = 'SECRET';
export const serverProcessName = 'mctrl-server';
export const clientProcessName = 'mctrl-client';
