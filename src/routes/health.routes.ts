
import { Router } from 'express';
import { dbHealth } from '../config/db.js';

const r = Router();
r.get('/', async (_req, res) => {
    let db = false;
    try { db = await dbHealth(); } catch { }
    res.json({ ok: true, db });
});
export default r;
