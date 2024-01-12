import { NextFunction, Request, Response } from 'express';

export function logging(req: Request, res: Response, next: NextFunction) {
  const { ip, path, method } = req;
  const time = new Date().toLocaleString();
  console.log(`💦💦💦 ${method} ${path} from ${ip} at ${time}`);
  return next();
}
