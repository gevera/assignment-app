import { PUBLIC_SITE_URL } from '$env/static/public';

export const SITE_URL = (PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
export const SITE_NAME = 'Demo';
