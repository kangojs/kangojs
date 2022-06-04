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

## ⚠️ PACKAGE DEPRECATED ⚠️
The `HTTPStatusCodes` enum has been moved to the core package ([`@kangojs/core`](https://www.npmjs.com/package/@kangojs/core)). It can now be accessed like this:

```ts
import { HTTPStatusCodes } from "@kangojs/core";

// will output 404
console.log(HTTPStatusCodes.NOT_FOUND)

// will output 503
console.log(HTTPStatusCodes.SERVICE_UNAVAILABLE)
```

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
For all available KangoJS packages [check out this list](https://github.com/kangojs/kangojs#-other-kangojs-packages).

## 💬 Feedback & Contributions
I'm open to feedback and contributions. Feel free to [raise an issue or suggest improvements and features](https://github.com/kangojs/kangojs/issues).

## 📝 License
This project is licensed under the terms of the [MIT license](https://choosealicense.com/licenses/mit/).
