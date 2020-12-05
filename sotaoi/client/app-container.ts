class AppContainer {
  protected services: { [key: string]: () => any } = {};

  public get<ClassType>(type: any): ClassType {
    return this.services[type.toString()]();
  }

  public bind<ClassType>(type: any, implementation: any): void {
    this.services[type.toString()] =
      typeof implementation === 'function' ? implementation : (): ClassType => implementation;
  }

  public singleton<ClassType>(type: any, implementation: () => ClassType): void {
    const singleton = implementation();
    this.services[type.toString()] = (): ClassType => singleton;
  }

  public has(item: { [key: string]: any; toString: (...args: any[]) => any }): boolean {
    return typeof this.services[item.toString()] !== 'undefined';
  }
}

export { AppContainer };
