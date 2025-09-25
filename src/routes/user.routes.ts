
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
// import { me } from '../controllers/user.controller.js';

const r = Router();

// r.get('/me', requireAuth, me);

export default r;
