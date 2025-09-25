
import app from './app.js';
import { env } from './config/env.js';
import { dbHealth } from './config/db.js';
import { logger } from './logger/logger.js';

(async () => {
    try {
        const dbOk = await dbHealth();
        if (!dbOk) logger.warn('DB healthcheck failed at startup');
        else logger.info('DB connected');

        app.listen(env.port, () => logger.info('Server listening', { port: env.port, env: env.nodeEnv }));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        logger.error('Startup error', { message });
        process.exit(1);
    }
})();
