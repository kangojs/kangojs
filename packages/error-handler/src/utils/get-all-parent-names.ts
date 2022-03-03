/**
 * Return a list of all parent names of the given object.
 *
 * @param obj
 * @param parentNames
 * @param currentPrototype
 * @return string[]
 */
export function getAllParentNames(obj: any, parentNames: string[] = [], currentPrototype?: any): string[] {
  let proto = currentPrototype ? currentPrototype : Object.getPrototypeOf(obj);

  if (proto?.name) {
    parentNames.push(proto.name)
  }
  else {
    return parentNames;
  }

  return getAllParentNames(obj, parentNames, Object.getPrototypeOf(proto));
}
