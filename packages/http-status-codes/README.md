<div align="center">
<h1>@kangojs/http-status-codes</h1>
<p>Provides an enum for HTTP status codes.</p>

<div>
  <a href="https://www.npmjs.com/package/@kangojs/http-status-codes" target="_blank">
    <img src="https://img.shields.io/npm/v/@kangojs/http-status-codes?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://choosealicense.com/licenses/mit/" target="_blank">
    <img src="https://img.shields.io/npm/l/@kangojs/http-status-codes?style=flat-square" alt="MIT License" />
  </a>
</div>
</div>

## 🤔 About
This package provides a single enum (`HTTPStatusCodes`) that maps human-readable names to status codes... that's all.

This package was created specifically for KangoJS with the intention of reducing third party dependencies.  
Obviously there are already many npm packages that offer this exact functionality perfectly fine such as [http-status-codes](https://www.npmjs.com/package/http-status-codes) which would be a better fit for general use.

## 🚀 Getting Started
Install the npm package:
```shell
npm install @kangojs/http-status-codes
```

## 👷 Usage
Simply import the package and use the enum where it's needed:

```typescript
import { HTTPStatusCodes } from '@kangojs/http-status-codes';

// will output 404
console.log(HTTPStatusCodes.NOT_FOUND)

// will output 503
console.log(HTTPStatusCodes.SERVICE_UNAVAILABLE)
```

**NOTE:** This is purposefully not an exhaustive list at the moment, it's just the ones I've found myself actually needing.

## 🧰 Other KangoJS Packages
- `@kangojs/kangojs` ([npm](https://www.npmjs.com/package/@kangojs/kangojs), [GitHub](https://github.com/kangojs/kangojs)) - The core framework that you can use to make Express app development quicker and easier.
- `@kangojs/class-dtos` ([npm](https://www.npmjs.com/package/@kangojs/class-dtos), [GitHub](https://github.com/kangojs/class-dtos)) - Create class DTOs to parse and validate request data using class-transformer & class-validator.
- `@kangojs/express-query-string` ([npm](https://www.npmjs.com/package/@kangojs/express-query-string), [GitHub](https://github.com/kangojs/express-query-string)) - Replace the default Express query string parser with [query-string](https://www.npmjs.com/package/query-string).
- `@kangojs/express-common-middleware` ([npm](https://www.npmjs.com/package/@kangojs/express-common-middleware), [GitHub](https://github.com/kangojs/express-common-middleware)) - Quickly include common Express middleware. Includes `express.json()`, `express.urlencoded()`, [cors](https://www.npmjs.com/package/cors) and [cookie-parser](https://www.npmjs.com/package/cookie-parser).

## 💬 Feedback & Contributions
I'm open to feedback and contributions. Feel free to [raise an issue or suggest improvements and features](https://github.com/kangojs/http-status-codes).

## 📝 License
This project is licensed under the terms of the [MIT license](https://choosealicense.com/licenses/mit/).
