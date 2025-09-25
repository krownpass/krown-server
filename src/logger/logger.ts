
type Level = 'debug' | 'info' | 'warn' | 'error';

function log(level: Level, msg: string, meta?: Record<string, unknown>) {
    const entry = { t: new Date().toISOString(), level, msg, ...meta };
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](JSON.stringify(entry));
}

export const logger = {
    debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
    info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
    warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
    error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
};
