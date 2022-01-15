import { NextFunction, Request, Response } from 'express';

/**
 * Configuration used internally in the main KangoJS object.
 */
export interface KangoJSConfig {
  controllerFilesGlob: string;
  globalPrefix: string | null;
}

/**
 * Options that can be passed to KangoJS when it's instantiated.
 */
export interface KangoJSOptions {
  controllerFilesGlob: string;
  globalPrefix?: string | null;
  authValidator?: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  bodyValidator?: (bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
  queryValidator?: (queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
}
