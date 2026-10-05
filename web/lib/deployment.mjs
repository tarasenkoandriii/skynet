// Shared by runtime, build gate and tests. Stage 19 never enables transactions.
export function deploymentState(env = process.env) {
  const environment = env.VERCEL_ENV || 'development';
  return { environment, informational_only: true, payment_enabled: false, qr_enabled: false,
    release_stage: 19, revision: env.RELEASE_REVISION || env.VERCEL_GIT_COMMIT_SHA || 'local' };
}
export function configurationErrors(env = process.env) {
  const errors = [];
  const environment = env.VERCEL_ENV || 'development';
  if (!['development', 'preview', 'production'].includes(environment)) errors.push('Unsupported environment');
  const fixed = { CAMPAIGN_MODE: 'DISABLED', PAYMENT_STATUS: 'DISABLED', LEGAL_PAYMENT_APPROVED: 'false', CONTACT_ENDPOINT_ENABLED: 'false' };
  for (const [key, value] of Object.entries(fixed)) {
    if ((env[key] !== undefined && env[key] !== value) || (environment !== 'development' && env[key] !== value)) errors.push(`${key} must be ${value}`);
  }
  for (const key of ['PAYMENT_PROVIDER', 'PAYMENT_CANONICAL_URL']) if (env[key]) errors.push(`${key} must be empty`);
  for (const key of ['PAYMENT_ENABLED', 'PAYMENT_LEGAL_APPROVED']) if (env[key] !== undefined) errors.push(`Remove obsolete ${key}`);
  const site = env.NEXT_PUBLIC_SITE_URL;
  if (site || environment !== 'development') {
    try {
      const u = new URL(site);
      if (site !== u.origin || u.protocol !== 'https:' || u.username || u.password || u.pathname !== '/' || u.search || u.hash || ['example.vercel.app', 'localhost'].includes(u.hostname)) throw new Error();
    } catch { errors.push('NEXT_PUBLIC_SITE_URL must be a real HTTPS origin without path, credentials, query or fragment'); }
  }
  if (environment !== 'development') {
    if (!['hobby', 'pro', 'enterprise'].includes(env.HOSTING_PLAN)) errors.push('HOSTING_PLAN is required');
    if (env.HOSTING_PLAN === 'hobby' && env.HOBBY_NONCOMMERCIAL_APPROVED !== 'true') errors.push('Hobby requires documented personal/non-commercial eligibility');
  }
  return errors;
}
