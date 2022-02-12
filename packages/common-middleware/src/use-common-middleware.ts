import express, { Application } from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { gnuTerryPratchett } from './middleware/gnu-terry-pratchett';

import { CommonMiddlewareOptions } from './types/common-middleware-options';
import { useMalformedRequestMiddleware } from './middleware/malformed-requests';

/**
 * A function to add common middleware to your Express app.
 *
 * @param app - An Express application
 * @param options - options to customise the functionality
 */
export function useCommonMiddleware(app: Application, options: CommonMiddlewareOptions = {}) {
  // JSON Parsing
  if (!options?.disable?.json) {
    if (options?.config?.json) {
      app.use(express.json(options.config.json));
    }
    else {
      app.use(express.json());
    }
  }

  // URL Encoding
  if (!options?.disable?.urlEncoded) {
    if (options?.config?.urlEncoded) {
      app.use(express.urlencoded(options.config.urlEncoded));
    }
    else {
      app.use(express.urlencoded({extended: true}));
    }
  }

  // CORS
  if (!options?.disable?.cors) {
    if (options?.config?.cors) {
      app.use(cors(options.config.cors));
    }
    else {
      app.use(cors());
    }
  }

  // Cookie Parser
  if (!options?.disable?.cookieParser) {
    if (!options.config?.cookieParser) {
      app.use(cookieParser());
    }
    else if (options.config.cookieParser.secret && options.config.cookieParser.options) {
      app.use(cookieParser(options.config.cookieParser.secret, options.config.cookieParser.options));
    }
    else if (options.config.cookieParser.secret) {
      app.use(cookieParser(options.config.cookieParser.secret));
    }
    else {
      app.use(cookieParser(undefined, options.config.cookieParser.options));
    }
  }

  // GNU Terry Pratchett
  if (!options?.disable?.gnuTerryPratchett) {
    app.use(gnuTerryPratchett);
  }

  // Malformed Request Handling
  if (!options?.disable?.malformedRequest) {
    if (options?.config?.malformedRequest) {
      useMalformedRequestMiddleware(app, options.config.malformedRequest);
    }
    else {
      useMalformedRequestMiddleware(app);
    }
  }
}
