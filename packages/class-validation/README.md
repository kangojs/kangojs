<div align="center">
<h1>@kangojs/class-validation</h1>
<p>Validate and transform request data using classes in KangoJS.</p>

<div>
  <a href="https://www.npmjs.com/package/@kangojs/class-validation" target="_blank">
    <img src="https://img.shields.io/npm/v/@kangojs/class-validation?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://choosealicense.com/licenses/mit/" target="_blank">
    <img src="https://img.shields.io/npm/l/@kangojs/class-validation?style=flat-square" alt="MIT License" />
  </a>
</div>
</div>

## 🤔 About
Easily transform and validate Express request data using classes with [class-transformer](https://www.npmjs.com/package/class-transformer) and  [class-validator](https://www.npmjs.com/package/class-validator).

This package has been built specifically for use with [KangoJS](https://github.com/kangojs/kangojs).
While you could potentially use this package without KangoJS, it isn't 'officially' supported at this time.

## 💥 Features
- Quickly integrate with KangoJS's validation system. Focus on writing project code not sorting request validation logic.
- Incoming request data is automatically transformed and attached to the Express `req` object.
- Use on both request body and query data.

## 🚀 Getting Started
Install the npm package:
```shell
npm install @kangojs/class-validation
```

**Peer Dependencies:**  
`@kangojs/class-validation` is primarily just a wrapper around [class-transformer](https://www.npmjs.com/package/class-transformer) and [class-validator](https://www.npmjs.com/package/class-validator)
so you must install these two peer dependencies yourself in order to use this package.

## 👷 Usage
As `@kangojs/class-validation` has been built specifically for use with KangoJS it's pretty much just a case of dropping it in.  

### Setup Validation Middleware
When setting up KangoJS you can simply pass the results of `createBodyValidator` and `createQueryValidator` into the configuration options like so:

```typescript
import express from 'express';
import { KangoJS } from '@kangojs/kangojs';
import { createBodyValidator, createQueryValidator } from "@kangojs/class-validation";

const app = express();

const kangoJS = new KangoJS({
    controllerFilesGlob: "src/modules/*.controller.ts",
    globalPrefix: "/api/v1",
    bodyValidator: createBodyValidator(),
    queryValidator: createQueryValidator(),
});
await kangoJS.boostrap(app);
```

You can also pass options to the create validator functions. Here are the possible options:

| Attribute | Type | Description |
| --- | --- | --- |
| `classTransformerOptions` | `TransformerOptions` (from class-transformer) | Options for class-transformer |
| `classValidatorOptions` | `ValidatorOptions` (from class-validator) | Options for class-validator |
| `errorHandler` | `(error: Error, res?: Response) => Promise<void>` | Allows you to overwrite the default behaviour on validation error. |

### Add Request Validation
Create a class DTO using class-validator. For example:

```typescript
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDTO {
    @IsEmail()
    email: string;
    
    @IsString()
    username: string;

    @IsString()
    @MinLength(12)
    password: string;
}
```

Add your DTO to the [`@Route`](https://github.com/kangojs/kangojs#routing) decorator provided by KangoJS:

```typescript
import { Request, Response, NextFunction } from 'express';
import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { RequestWithDto } from '@kangojs/class-validation';
import { UserAddDTO } from './user-add.dto';

@Controller('/users')
export class UserController {
    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: UserAddDTO
    })
    async addUser(req: RequestWithDto, res: Response, next: NextFunction) {
        const userAddDto = <UserAddDTO> req.bodyDto;
        
        return res.send('You have just attempted add a user via /users [POST].');
    }
}
```

This process is exactly the same for query data except you use the `queryShape` route option and `req.queryDto` to access
the transformed data instead.

### Default Behaviour
This package has sensible defaults for validation options and error handling.

#### Validation
The default options for class-validator are as follows:

```typescript
{
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: {
        target: false
    }
}
```

#### Error Handling
When validation fails the default behaviour is to return a `400` response with the following body data:

```json
{
    "statusCode": 400,
    "message": "The supplied body data did not pass validation.",
    "reason": "first error reason from class-validator if applicable"
}
```

## 🧰 Other KangoJS Packages
- `@kangojs/kangojs` ([npm](https://www.npmjs.com/package/@kangojs/kangojs), [GitHub](https://github.com/kangojs/kangojs)) - The core framework that you can use to manage controllers and routes.
- `@kangojs/express-query-string` ([npm](https://www.npmjs.com/package/@kangojs/express-query-string), [GitHub](https://github.com/kangojs/express-query-string)) - Allows you to replace the default Express query string parser with [query-string](https://www.npmjs.com/package/query-string).
- `@kangojs/express-common-middleware` ([npm](https://www.npmjs.com/package/@kangojs/express-common-middleware), [GitHub](https://github.com/kangojs/express-common-middleware)) - Quickly include common Express middleware. Includes `express.json()`, `express.urlencoded()`, [cors](https://www.npmjs.com/package/cors) and [cookie-parser](https://www.npmjs.com/package/cookie-parser).

## 💬 Feedback & Contributions
I'm open to feedback and contributions. Feel free to [raise an issue or suggest improvements and features](https://github.com/kangojs/class-validation).

## 📝 License
This project is licensed under the terms of the [MIT license](https://choosealicense.com/licenses/mit/).
