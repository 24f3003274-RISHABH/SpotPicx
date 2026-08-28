import dotenv from 'dotenv';
dotenv.config();
// config file 
export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // JWT Authentication Secrets & Expiries
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'spotpicks_dev_jwt_access_secret_32_chars_long',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'spotpicks_dev_jwt_refresh_secret_32_chars_long',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  API_PREFIX: '/api/v1',
};
