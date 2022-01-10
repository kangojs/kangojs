<div align="center">
<h1>KangoJS</h1>
<p>An ExpressJS framework to make writing typescript express apps quicker and easier.</p>

<div>
  <a href="https://www.npmjs.com/package/@kangojs/kangojs" target="_blank">
    <img src="https://img.shields.io/npm/v/@kangojs/kangojs?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://choosealicense.com/licenses/mit/" target="_blank">
    <img src="https://img.shields.io/npm/l/@kangojs/kangojs?style=flat-square" alt="MIT License" />
  </a>
</div>
</div>


## Features
- Declare routes by adding decorators to classes.
- Concepts such as route authentication and request validation are built in.
- Approach agnostic request logic. You are responsible for registering request validation & route authentication 
functions yourself which gives you the freedom to use any implementation you wish.

## Getting Started
Install the npm package:
```shell
npm install @kangojs/kangojs
```

To use decorators in typescript you will have to add the following settings to your `tsconfig.json` file:
```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

## Usage
To use KangoJS you can bootstrap it with your Express app like so:
```ts
import express from 'express';
import { KangoJS } from '@kangojs/kangojs';

const app = express();

const kangoJS = new KangoJS({
  controllerFilesGlob: "src/modules/*.controller.ts",
  globalPrefix: "/api/v1",
});
await kangoJS.boostrap(app);
```
The following options are available when instantiating `KangoJS`:

| Property              | Type                                                                                     | Description                                                                                                                                       | Example                         |
|-----------------------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| `controllerFilesGlob` | `string`                                                                                 | A [glob pattern](https://github.com/isaacs/node-glob#glob-primer) relative to the project root that tells KangoJS where to look for controllers. | `"src/modules/*.controller.ts"` |
| `globalPrefix`        | `string`                                                                                 | An optional string that will prefix all routes that KangoJS generates.                                                                           | `"/api/v1"`                     |
| `authFunction`        | `(req: Request, res: Response, next: NextFunction) => Promise<any>`                      | An optional middleware function that will be used when a route requires authentication.                                                           | see examples below              |
| `validateBody`        | `(bodyShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>`  | An optional function that will be used for request body validation if you add the `bodyShape` property to a route.                                | see examples below              |
| `validateQuery`       | `(queryShape: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>` | An optional function that will be used for request query validation if you add the `queryShape` property to a route.                              | see examples below              |


### Project Structure Assumptions 
KangoJS has been designed with the assumption that your app will be split into separate modules/components
where each module/component has its own controller for handling Express routing.  
This is based on the [module structure of NestJS](https://docs.nestjs.com/modules) and the generally agreed upon [best practise of Node.js app structure](https://github.com/goldbergyoni/nodebestpractices#1-project-structure-practices)
where applications encapsulate functionality into separate modules/components and use layers such as controllers and services to separate business logic from web request logic.

That being said, the only hard assumption KangoJS enforces is the use of controllers that have routes defined as decorated methods.

### Controllers
Controllers are classes that encapsulate ExpressJS request & response logic. KangoJS attempts to load controllers from all files
that match the `controllerFilesGlob` passed in the options.  
You mark a class as a controller with the `@Controller` decorator and pass what path the controller will manage, for example:

```typescript
import { Controller } from '@kangojs/kangojs';

@Controller('/users')
class UserController {
  // add route methods here...
}

export default UserController;
```

**IMPORTANT NOTE:** Controller classes must be set as the default export of the file!

### Routing
Routes are added to controllers by adding the `@Route` decorator to methods. For example:

```typescript
import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

@Controller('/users')
class UserController {
  @Route({
    httpMethod: HTTPMethods.GET,
  })
  async getAll(req: Request, res: Response, next: NextFunction) {
    return res.send('You have just attempted to fetch all users via /users [GET].');
  }

  @Route({
    path: '/:id',
    httpMethod: HTTPMethods.GET,
  })
  async get(req: Request, res: Response, next: NextFunction) {
    return res.send(`You have just attempted to fetch user ${req.params.id} via /users/:id [GET].`);
  }

  @Route({
    httpMethod: HTTPMethods.POST,
  })
  async add(req: Request, res: Response, next: NextFunction) {
    return res.send(`You have just attempted to add a new user via /users [POST].`);
  }
}

export default UserController;
```

The following options are available for the `@Route` decorator:

| Property       | Type                                  | Description                                                                                                                                                                        |
|----------------|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `path`         | `string`                              | An optional string to add to the end of the controllers main path.                                                                                                                 |
| `httpMethod`   | one of the `HTTPMethods` enum values. | Defines what HTTP method the route uses.                                                                                                                                           |
| `requiresAuth` | `boolean`                             | Defines if the route requires authentication (requires the `authFunction` to be set). **For safety you must explicitly set `requiresAuth:false` to disable route authentication.** |
| `bodyShape`    | `any`                                 | An optional property where you can pass what shape you expect the request body to have (requires the `validateBody` function to be set).                                           |
| `queryShape`   | `any`                                 | An optional property where you can pass what shape you expect the request query to have (requires the `validateQuery` function to be set).                                         |

## Feedback & Contributions
I'm open to feedback and contributions. Feel free to raise an issue or suggest improvements and features on [GitHub](https://github.com/kangojs/kangojs).

## License
This project is licensed under the terms of the [MIT license](https://choosealicense.com/licenses/mit/).

## Credits
I used [this article](https://nehalist.io/routing-with-typescript-decorators) for some initial guidance and
inspiration on how to implement decorator based routing in typescript.
