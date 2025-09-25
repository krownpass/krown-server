
import { Response } from 'express';

export function ok<T>(res: Response, data: T) {
    return res.status(200).json({ ok: true, data });
}
export function created<T>(res: Response, data: T) {
    return res.status(201).json({ ok: true, data });
}
export function noContent(res: Response) {
    return res.status(204).send();
}
