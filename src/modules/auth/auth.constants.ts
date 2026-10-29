export const JWT_ISSUER = 'slop-battle';
export const JWT_AUDIENCE = 'slop-battle-api';
// Admin tokens get their own audience so the player strategy rejects them, and vice versa.
export const ADMIN_JWT_AUDIENCE = 'slop-battle-backoffice';
export const ADMIN_JWT_EXPIRES_IN = '8h';
