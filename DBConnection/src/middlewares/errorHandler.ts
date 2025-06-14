import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const response = { error: err.message };
  if (process.env.NODE_ENV !== 'production') {
    Object.assign(response, { stack: err.stack });
  }
  console.error(err);
  res.status(500).json(response);
}