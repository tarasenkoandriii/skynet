export function deploymentState(env?: NodeJS.ProcessEnv): {environment:string; informational_only:boolean; payment_enabled:boolean; qr_enabled:boolean; release_stage:number; revision:string};
export function configurationErrors(env?: NodeJS.ProcessEnv): string[];
