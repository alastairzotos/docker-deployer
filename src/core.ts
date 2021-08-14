export type Commands = { [key: string]: (...args: any[]) => Promise<any> };

export const cliName = 'ddeploy';
export const processName = 'docker-deployer';
export const pwdKey = 'PASSWORD_HASH';