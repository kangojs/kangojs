import { Response } from "express";

/**
 * Options to customise the middleware functionality.
 */
export interface UseServeSPAOptions {
    folderPath: string,
    serveFile?: string,
    baseRoute?: string,
    fallbackMessage?: string,
    errorhandler?: (err: any, res?: Response) => Promise<void>
}
