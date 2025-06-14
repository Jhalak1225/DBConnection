import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async  function verifyUserToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    var user = jwt.verify(token, 'secret');
    user = await req.body().user ; 
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}