import { Request } from "express";

/**
 * Extends the default Express request type to support adding DTO attributes.
 */
export interface RequestWithDto extends Request {
    bodyDto?: any;
    queryDto?: any;
    paramsDto?: any;
}
