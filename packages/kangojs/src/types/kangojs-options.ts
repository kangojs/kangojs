import { NextFunction, Request, Response } from 'express';

/**
 * Options that can be passed to KangoJS when it's instantiated.
 */
export type KangoJSOptions = {
  controllerFilesGlob: string;
  controllers?: undefined;
  globalPrefix?: string | null;
  authValidator?: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  bodyValidator?: (bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
  queryValidator?: (queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
} | {
  controllers: Object[];
  controllerFilesGlob?: undefined;
  globalPrefix?: string | null;
  authValidator?: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  bodyValidator?: (bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
  queryValidator?: (queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
}
