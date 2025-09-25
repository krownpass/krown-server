import { supabase, supabaseAdmin } from "../config/supabase.js";
import { UsersRepo } from "../db/repositories/users.repo.js";
import { AppError } from "../core/errors.js";
import { env } from "../config/env.js";

export interface SignUpInput {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export interface SignInInput {
    email: string;
    password: string;
}

export interface OAuthStartInput {
    provider: "google" | "github" | "gitlab" | "bitbucket" | "azure";
    redirect_to?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthService = {
    // --------------------
    // Validation
    // --------------------
    validateSignUp(body: any): SignUpInput {
        if (!body?.email || !EMAIL_RE.test(body.email)) throw AppError.badRequest("Invalid email");
        if (!body?.password || body.password.length < 8) throw AppError.badRequest("Password must be at least 8 chars");
        if (!body?.name || String(body.name).trim().length === 0) throw AppError.badRequest("Name is required");
        if (body?.phone && String(body.phone).length < 7) throw AppError.badRequest("Phone too short");

        return { email: body.email, password: body.password, name: body.name, phone: body.phone };
    },

    validateSignIn(body: any): SignInInput {
        if (!body?.email || !EMAIL_RE.test(body.email)) throw AppError.badRequest("Invalid email");
        if (!body?.password) throw AppError.badRequest("Password required");

        return { email: body.email, password: body.password };
    },

    validateOAuthStart(query: any): OAuthStartInput {
        const providers = ["google", "github", "gitlab", "bitbucket", "azure"] as const;
        const provider = query?.provider as OAuthStartInput["provider"];

        if (!provider || !providers.includes(provider)) {
            throw AppError.badRequest("Invalid provider");
        }

        if (query?.redirect_to && typeof query.redirect_to !== "string") {
            throw AppError.badRequest("Invalid redirect_to");
        }

        return { provider, redirect_to: query?.redirect_to };
    },

    // --------------------
    // Auth methods
    // --------------------
    async signUp(input: SignUpInput) {
        const { data, error } = await supabase.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
                data: { name: input.name, phone: input.phone },
                emailRedirectTo: env.publicOAuthRedirectUrl,
            },
        });

        if (error) throw AppError.badRequest(error.message);

        if (data.user) {
            await UsersRepo.upsertMirrorUser({
                supabase_user_id: data.user.id,
                user_email: data.user.email!,
                user_name: (data.user.user_metadata as any)?.name ?? null,
                phone: (data.user.user_metadata as any)?.phone ?? null,
                is_email_verified: Boolean(data.user.email_confirmed_at),
            });
        }

        return { id: data.user?.id, email: data.user?.email };
    },

    async signIn(input: SignInInput) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: input.email,
            password: input.password,
        });

        if (error) throw AppError.unauthorized(error.message);

        if (data.user) {
            await UsersRepo.upsertMirrorUser({
                supabase_user_id: data.user.id,
                user_email: data.user.email!,
                user_name: (data.user.user_metadata as any)?.name ?? null,
                phone: (data.user.user_metadata as any)?.phone ?? null,
                is_email_verified: Boolean(data.user.email_confirmed_at),
            });
        }

        return {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
            expires_in: data.session?.expires_in,
            token_type: data.session?.token_type,
            user: { id: data.user?.id, email: data.user?.email },
        };
    },

    async oauthStart(input: OAuthStartInput) {
        console.log("OAuthStart redirect_to received:", input.redirect_to);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: input.provider,
            options: {
                redirectTo: input.redirect_to || env.publicOAuthRedirectUrl,
            },
        });

        if (error) throw AppError.badRequest(error.message);

        console.log("Supabase returned OAuth URL:", data.url);
        return { url: data.url };
    },

    async handleWebhook(payload: any, signature?: string) {
        if (signature !== env.webhookSecret) throw AppError.unauthorized("Invalid webhook signature");
        const record = payload?.record;
        if (!record?.id || !record?.email) throw AppError.badRequest("Invalid webhook payload");

        await UsersRepo.upsertMirrorUser({
            supabase_user_id: record.id,
            user_email: record.email,
            user_name: record.user_metadata?.name ?? null,
            phone: record.user_metadata?.phone ?? null,
            is_email_verified: Boolean(record.email_confirmed_at),
        });

        return { event: payload?.type ?? "unknown", ok: true };
    },
};
