import { OptionsJson, OptionsUrlencoded } from 'body-parser'
import { CorsOptions } from 'cors';
import { CookieParseOptions } from 'cookie-parser';
import { MalformedRequestOptions } from './malformed-request-options';

/**
 * Customisation options for the useCommonMiddleware function.
 */
export interface CommonMiddlewareOptions {
  disable?: {
    json?: boolean,
    urlEncoded?: boolean,
    cors?: boolean,
    cookieParser?: boolean,
    gnuTerryPratchett?: boolean,
    malformedRequest?: boolean
  },
  config?: {
    json?: OptionsJson
    urlEncoded?: OptionsUrlencoded
    cors?: CorsOptions,
    cookieParser?: {
      options?: CookieParseOptions,
      secret?: string | string[] | undefined
    },
    malformedRequest?: MalformedRequestOptions
  }
}
