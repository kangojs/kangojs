<div align="center">
<h1>kango.js</h1>
<p>An <a href="https://expressjs.com/">ExpressJS</a> framework to make writing typescript express apps quicker and easier.</p>

<div>
  <a href="https://www.npmjs.com/package/kango.js" target="_blank">
    <img src="https://img.shields.io/npm/v/kango.js?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://choosealicense.com/licenses/mit/" target="_blank">
    <img src="https://img.shields.io/npm/l/kango.js?style=flat-square" alt="MIT License" />
  </a>
</div>
</div>


## Features
- Declare routes by adding decorators to classes.
- Concepts such as protected routes and request validation are built in.
- Approach agnostic request logic. You are responsible for registering request validation & route authentication 
functions yourself which gives you the freedom to use any implementation you wish.

## Installation
```shell
npm install kango.js
```

## Usage
To use kango.js simply bootstrap it with your Express app like so:
```ts
import express from 'express';
import { ControllerLoader } from 'kango.js';

const app = express();

const controllerLoader = new ControllerLoader({
  globalPrefix: "/api/v1",
  controllerFilesGlob: "src/modules/*.controller.ts",
});
await controllerLoader.boostrap(app);
```

You can then create controller class files (in locations that match `controllerFilesGlob`) and use the 
`@Controller` and `@Route` decorators to add the information that kango.js needs to generate the Express routes:
```ts
import { Request, Response } from 'express';
import { Controller, HTTPMethods, Route } from 'kango.js';

@Controller('/users')
class UserController {
  constructor() {}

  @Route({
    httpMethod: HTTPMethods.GET,
    protected: false,
  })
  async getMessage(req: Request, res: Response) {
    return res.send("You have just called the /users [GET] endpoint.");
  }

  @Route({
    path: "/:id",
    httpMethod: HTTPMethods.GET
  })
  async getUser(req: Request, res: Response) {
    return res.send(`You have just requested user ${+req.params.id} from /users/:id [GET].`);
  }

  @Route({
    httpMethod: HTTPMethods.POST
  })
  async getUser(req: Request, res: Response) {
    return res.send(`You have just tried to add a new user via the /users [POST] endpoint.`);
  }
}

export default UserController;
```

## Feedback & Contributions
I'm open to feedback and contributions. Feel free to raise an issue or suggest improvements and features on GitHub.

## License
This project is licensed under the terms of the [MIT license](https://choosealicense.com/licenses/mit/).
