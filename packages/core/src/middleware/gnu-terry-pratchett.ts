import { NextFunction, Request, Response } from "express";

/**
 * GNU Terry Pratchett (http://www.gnuterrypratchett.com/)
 */
export function gnuTerryPratchett(req: Request, res: Response, next: NextFunction) {
  res.set("X-Clacks-Overhead", "GNU Terry Pratchett");
  next();
}
