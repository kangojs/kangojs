import { join, resolve } from 'path';
import { Application, Request, Response, static as serveStatic } from 'express';

import { UseServeSPAOptions } from "./types/use-serve-spa-options";
import { handleError } from './handle-error';


/**
 * Set up an Express app to serve a single page web application.
 *
 * @param app - An Express application instance
 * @param options - Options to customise the middleware functionality
 */
export function useServeSPA(app: Application, options: UseServeSPAOptions) {
    // Serve static files from the app's folder.
    app.use(options.baseRoute || '/', serveStatic(join(__dirname, options.folderPath)));

    // Process the route that the main middleware will be used on.
    let serveRoute;
    if (options.baseRoute) {
        serveRoute = options.baseRoute.endsWith('/') ? `${options.baseRoute}*` : `${options.baseRoute}/*`
    }
    else {
        serveRoute = "/*"
    }

    // Serve the app for all GET requests to the given route.
    app.get(serveRoute, async (req: Request, res: Response) => {
        try {
            return res.sendFile(
              resolve(__dirname, options.folderPath , options.serveFile || 'index.html'),
              async (error) => {
                  if (error !== undefined) {
                      await handleError(options, error, res);
                  }
              }
            );
        }
        catch (err: any) {
            await handleError(options, err, res);
        }
    });
}
