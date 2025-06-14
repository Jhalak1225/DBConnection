import { Request, Response, NextFunction } from 'express';

export function IsUser(req: Request, res: Response, next: NextFunction) {
  if (req.user?.user_type_id === 0) return next();
  res.status(403).json({ error: 'User access only' });
}

export function IsAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.user_type_id === 1) return next();
  res.status(403).json({ error: 'Admin access only' });
}