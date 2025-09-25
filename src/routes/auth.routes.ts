
import { Router } from 'express';
import { oauthStartController, signIn, signUp, supabaseWebhook } from '../controllers/auth.controller.js';

const r = Router();
r.post('/signup', signUp);
r.post('/signin', signIn);
r.get('/oauth', oauthStartController);
r.post('/webhooks/supabase', supabaseWebhook);
export default r;
