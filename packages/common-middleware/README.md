<div align="center">
<h1>@kangojs/common-middleware</h1>
<p>Quickly include common Express middleware in your project.</p>

<div>
  <a href="https://www.npmjs.com/package/@kangojs/common-middleware" target="_blank">
    <img src="https://img.shields.io/npm/v/@kangojs/common-middleware?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://choosealicense.com/licenses/mit/" target="_blank">
    <img src="https://img.shields.io/npm/l/@kangojs/common-middleware?style=flat-square" alt="MIT License" />
  </a>
</div>
</div>

## ⚠️ PACKAGE DEPRECATED ⚠️
This packages functionality has been moved to the core package [`@kangojs/core`](https://www.npmjs.com/package/@kangojs/core).

## 🤔 About
There are common middleware functions and packages that are used in a lot of Express projects.  
This package bundles all those together into one central place to make it quicker and easier to include them.

While this package has been built mainly for use with [KangoJS](https://github.com/kangojs/kangojs), it's not
doing anything other than creating & managing Express middleware, so it should work in any Express project.

## 💥 Features
- Common Middleware
  - Parse request data with `express.json()`
  - Parse URLs with `express.urlencoded()`
  - Configure CORS with the [cors](https://www.npmjs.com/package/cors) package
  - Parse incoming cookie data with the [cookie-parser](https://www.npmjs.com/package/cookie-parser) package
- Handle common errors
  - Malformed requests will return a `400` error by default
  - Provides optional middleware for handing `404` errors
- Configurable
  - All configuration options for packages are exposed if you need to customise them
  - All features can be disabled individually if you want to opt out of one or more of them
- Other
  - Add a custom header for [GNU Terry Pratchett](http://www.gnuterrypratchett.com/)

## 🚀 Getting Started
Install the npm package:
```shell
npm install @kangojs/common-middleware
```

`express` is listed as a peer dependency as it's assumed that you'll have this dependency in
your project already.

## 👷 Usage

### Common Middleware
Using the common middleware in your app is as simple as calling the `useCommonMiddleware` function as shown below:

```typescript
import { useCommonMiddleware } from '@kangojs/common-middleware';

useCommonMiddleware(app);
```

This should be enough for most basic use cases, however you can pass configuration options if you need to customise any middleware (see below).

#### Configuration
It's possible to pass configuration options to `useCommonMiddleware` which gives you fully control over the underlying middleware functions. For example:

```typescript
import { useCommonMiddleware } from '@kangojs/common-middleware';

const options = {
  config: {
    cors: {} // object that matches CorsOptions from the cors package
  }
};

useCommonMiddleware(app, options);
```

All configuration options are added to `config` as shown above and the available properties are as follows:
- `json` - `OptionsJson` object to be passed to `express.json`
- `urlEncoded` - `OptionsUrlencoded` object to be passed to `express.urlencoded` (**IF NOT SUPPLIED A DEFAULT OF `{extended: true}` IS USED**)
- `cors` - `CorsOptions` object to be passed to cors,
- `cookieParser.options` - `CookieParseOptions` object to be passed to cookie-parser,
- `cookieParser.secret` - `string | string[] | undefined` to be passed to cookie-parser
- `malformedRequest` - see below for details

### Malformed Request Middleware
Part of the default behaviour of `useCommonMiddleware` is to add an error handler for malformed requests.
If a request has malformed data this handler will return a response with a `400` status code and the following body data:

```json
{
      "statusCode": 400,
      "message": "The request data appears malformed."
}
```

You can customise the message that's shown by passing options to `useCommonMiddleware` like so:

```typescript
import { useCommonMiddleware } from '@kangojs/common-middleware';

const options = {
  config: {
    malformedRequest: {
      message: "You've sent malfored request data you banana, try again."
    }
  }
}

useCommonMiddleware(app, options);
```

### Route Not Found Middleware
Almost every Express app will have some form of 'route not found' (404) fallback response.  
If you want to use the one provided by this package you can simply call `useNotFoundMiddleware` after all other route logic like so:

```typescript
import { useNotFoundMiddleware } from '@kangojs/common-middleware';

useNotFoundMiddleware(app);
```

When a request doesn't have any matching routes, a `404` response is returned with the following body data:

```json
{
      "statusCode": 404,
      "message": "The requested route was not found."
}
```

You can customise the behaviour of `useNotFoundMiddleware` by passing any of these options:

| Option | Type | Description |
| --- | --- | --- |
| `path` | `string` | Used to specific a path for the middleware  |
| `message` | `string` | Set a custom response message |

Example use of these options:

```typescript
import { useNotFoundMiddleware } from '@kangojs/common-middleware';

const options = {
  path: "/api/*",
  message: "That API route does not exist."
}

useNotFoundMiddleware(app, options);
```

### Disabling Middleware
If you want to fully disable a particular middleware you can set its corresponding property to `true` in the `disable` config object, for example:

```typescript
import { useCommonMiddleware } from '@kangojs/common-middleware';

const options = {
  disabe: {
    cookieParser: true
  }
}

useCommonMiddleware(app, options);
```

Possible `disable` properties are as follows:
- `json` to disable `express.json`
- `urlEncoded` to disable `express.urlencoded`
- `cors` to disable cors
- `cookieParser` to disable cookie-parser
- `gnuTerryPratchett` to disable adding the `X-Clacks-Overhead` header
- `malformedRequest` to disable the built-in malformed request handling

## 🧰 Other KangoJS Packages
For all available KangoJS packages [check out this list](https://github.com/kangojs/kangojs#-other-kangojs-packages).

## 💬 Feedback & Contributions
I'm open to feedback and contributions. Feel free to [raise an issue or suggest improvements and features](https://github.com/kangojs/kangojs/issues).

## 📝 License
This project is licensed under the terms of the [MIT license](https://choosealicense.com/licenses/mit/).
