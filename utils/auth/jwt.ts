import { jwtDecode } from 'jwt-decode';

export type JWTPayload = {
  userId: string;
  exp: number;
  iat: number;
};

export function decodeToken(token?: string): JWTPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, bufferSeconds = 30) {
  const payload = decodeToken(token);
  if (!payload) return true;

  const now = Date.now() / 1000;
  return payload.exp < now + bufferSeconds;
}
