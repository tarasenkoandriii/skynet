import {NextResponse} from 'next/server';
import {deploymentState,configurationErrors} from '@/lib/deployment.mjs';
export const dynamic='force-dynamic';
export function GET(){const errors=configurationErrors();return NextResponse.json({ok:errors.length===0,service:'narodne-ppo-landings',node_version:process.version,...deploymentState()},{status:errors.length?503:200,headers:{'Cache-Control':'no-store'}})}
