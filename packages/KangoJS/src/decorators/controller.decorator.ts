function Controller(route: string = ''): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata('route', route, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (! Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
}

export { Controller }
