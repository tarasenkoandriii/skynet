import {deploymentState} from './deployment.mjs';
export type PaymentGate={enabled:boolean;reason:string};
export function paymentGate():PaymentGate{return {enabled:deploymentState().payment_enabled,reason:'Stage 19: legal/provider gates remain open; payment and QR activation requires a reviewed release.'};}
