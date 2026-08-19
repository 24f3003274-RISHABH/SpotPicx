import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserRole } from '../constants/roles';

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}): string => {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: {
  id: string;
  role: UserRole;
}): string => {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};
