import getEnvVariable from 'dashboard/helpers/get-env-variable';

export const ACCOUNTS_URL = getEnvVariable(process.env.ACCOUNTS_URL, 'string', true);
export const API_URL = getEnvVariable(process.env.API_URL, 'string', true);
export const BOOKIE_URL = getEnvVariable(process.env.BOOKIE_URL, 'string', true);
export const GA_TRACKING_CODE = "UA-77313135-1";
export const INTEGRATIONS_URL = getEnvVariable(process.env.INTEGRATIONS_URL, 'string', true);
export const SLACK_CLIENT_ID = getEnvVariable(process.env.SLACK_CLIENT_ID, 'string', true);
export const STRIPE_KEY = getEnvVariable(process.env.STRIPE_KEY, 'string', true);