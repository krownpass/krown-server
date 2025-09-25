import { Request, Response } from "express";
import { asyncHandler } from "../core/asyncHandler.js";
import { created, ok } from "../utils/response.js";
import { AuthService } from "../services/auth.service.js";

// Email/password signup
export const signUp = asyncHandler(async (req: Request, res: Response) => {
    const dto = AuthService.validateSignUp(req.body);
    const user = await AuthService.signUp(dto);
    return created(res, { message: "Sign-up initiated. Verify your email.", user });
});

// Email/password signin
export const signIn = asyncHandler(async (req: Request, res: Response) => {
    const dto = AuthService.validateSignIn(req.body);
    const session = await AuthService.signIn(dto);
    return ok(res, session);
});

// OAuth start
export const oauthStartController = asyncHandler(async (req: Request, res: Response) => {
    console.log("Controller received query:", req.query); // 👈 debug
    const dto = AuthService.validateOAuthStart(req.query);
    const link = await AuthService.oauthStart(dto);
    return ok(res, link);
});

// Supabase webhook
export const supabaseWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.header("x-supabase-signature");
    const result = await AuthService.handleWebhook(req.body, signature || undefined);
    return ok(res, result);
});
