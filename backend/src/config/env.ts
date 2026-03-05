import dotenv from 'dotenv'
dotenv.config()

export const env = {
  DATABASE_URL:   process.env.DATABASE_URL!,
  REDIS_URL:      process.env.REDIS_URL!,
  JWT_SECRET:     process.env.JWT_SECRET!,
  REFRESH_SECRET: process.env.REFRESH_SECRET!,
  PORT:           process.env.PORT || '4000',
  NODE_ENV:       process.env.NODE_ENV || 'development',
}