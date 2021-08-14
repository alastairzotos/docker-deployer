export type Commands = { [key: string]: (...args: any[]) => Promise<any> };

export const cliName = 'ddeploy';
export const processName = 'docker-deployer';
