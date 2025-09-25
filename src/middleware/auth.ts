import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../core/errors.js';

// Express request with attached user info
export interface AuthedRequest extends Request {
    auth?: {
        userId: string;
        email?: string | undefined;
        raw: any;
    };
}

// Auth middleware: validate Bearer token with Supabase
export async function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
    const auth = req.header('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return next(AppError.unauthorized('Missing Bearer token'));

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return next(AppError.unauthorized('Invalid or expired token'));

    // attach user info for downstream handlers
    req.auth = {
        userId: data.user.id,
        email: data.user.email ?? undefined,
        raw: data.user,
    };
    return next();
}
