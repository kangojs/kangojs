import { NextFunction, Request, Response } from 'express';

/**
 * Options that can be passed to KangoJS when it's instantiated.
 */
export interface KangoJSOptions {
  controllerFilesGlob: string;
  globalPrefix?: string;
  authValidator?: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  bodyValidator?: (bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
  queryValidator?: (queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
}
