import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.string().default('INFO'),
  PORT: z.coerce.number().default(5173),
  DATA_PROVIDER: z.string().default('sportradar'),
  DATA_PROVIDER_BASE_URL: z.string().default('https://example.invalid'),
  DATA_PROVIDER_API_KEY: z.string().optional(),
  DATA_PROVIDER_TIMEOUT_SECONDS: z.coerce.number().default(10),
  REFRESH_INTERVAL_SECONDS: z.coerce.number().default(30),
  MAX_RETRIES: z.coerce.number().default(3),
  RETRY_BACKOFF_SECONDS: z.coerce.number().default(2),
  DEFAULT_TOURNAMENT_YEAR: z.coerce.number().default(2026),
  DEFAULT_DIVISION: z.enum(['men', 'women', 'both']).default('both'),
  DEFAULT_THEME: z.enum(['dark', 'light']).default('dark'),
  CACHE_ENABLED: z.coerce.boolean().default(true),
  CACHE_DIR: z.string().default('.cache'),
  CACHE_TTL_SECONDS: z.coerce.number().default(300),
  EXPORT_DEFAULT_DIR: z.string().default('exports'),
  EXPORT_DELIMITER: z.string().default(',')
});

export const env = envSchema.parse(process.env);
