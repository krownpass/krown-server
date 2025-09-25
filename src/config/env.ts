// src/config/env.ts
import 'dotenv/config';

const req = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing env ${k}`);
    return v;
};

export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    dbUrl: req('DATABASE_URL'),

    supabaseUrl: req('SUPABASE_URL'),
    supabaseAnonKey: req('SUPABASE_ANON_KEY'),
    supabaseServiceRoleKey: req('SUPABASE_SERVICE_ROLE_KEY'),

    webhookSecret: req('SUPABASE_WEBHOOK_SECRET'),
    publicOAuthRedirectUrl: req('PUBLIC_OAUTH_REDIRECT_URL'),

    // split comma-separated origins into array
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "")
        .split(",")
        .map(o => o.trim())
        .filter(Boolean),
};

export const isProd = env.nodeEnv === 'production';
