import { NextFunction, Request, Response } from 'express';

interface ControllerLoaderConfig {
  controllerFilesGlob: string;
  globalPrefix: string | null;
}

interface ControllerLoaderConstructorOptions {
  controllerFilesGlob: string;
  globalPrefix?: string | null;
  authFunction?: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  validateBody?: (bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
  validateQuery?: (queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export {
  ControllerLoaderConfig,
  ControllerLoaderConstructorOptions
}
