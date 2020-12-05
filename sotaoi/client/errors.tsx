const Errors: { [key: string]: { new (): Error } } = {
  NotFoundView: class NotFoundViewError extends Error {},
  ComponentFail: class ComponentFailError extends Error {},
  NotFoundLayout: class NotFoundLayoutError extends Error {},
};

export { Errors };
