import _ from 'lodash';

type TransformerFn = (
  item: any,
  prefix: string,
  iterate: (item: any, prefix: string, transformer: TransformerFn, prop: string) => any,
  prop: string,
) => any;

type TransformerAsyncFn = (
  item: any,
  prefix: string,
  iterate: (item: any, prefix: string, transformer: TransformerFn, prop: string) => any,
  prop: string,
) => Promise<any>;

class Helper {
  public static async pause(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  public static clone<ObjectType>(object: ObjectType): ObjectType {
    return _.cloneDeep(object);
  }

  public static flatten(obj: { [key: string]: any }, prefix = ''): { [key: string]: any } {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && Object.keys(obj[k]).length > 0) {
        Object.assign(acc, this.flatten(obj[k], pre + k));
        return acc;
      }
      acc[pre + k] = obj[k];
      return acc;
    }, {});
  }

  public static unflatten(obj: { [key: string]: any }): { [key: string]: any } {
    return Object.keys(obj).reduce((res, k) => {
      k.split('.').reduce(
        (acc: any, e, i, keys) =>
          acc[e] || (acc[e] = isNaN(Number(keys[i + 1])) ? (keys.length - 1 === i ? obj[k] : {}) : []),
        res,
      );
      return res;
    }, {});
  }

  public static iterate(obj: { [key: string]: any }, stack: string, transformer: TransformerFn): any {
    if (typeof obj !== 'object') {
      return obj;
    }
    for (const prop of Object.keys(obj)) {
      obj[prop] = transformer(obj[prop], stack, transformer, prop);
    }
    return obj;
  }

  public static async iterateAsync(
    obj: { [key: string]: any },
    stack: string,
    transformer: TransformerAsyncFn,
  ): Promise<any> {
    if (typeof obj !== 'object') {
      return obj;
    }
    for (const prop of Object.keys(obj)) {
      obj[prop] = await transformer(obj[prop], stack, transformer, prop);
    }
    return obj;
  }
}

export { Helper };
export type { TransformerFn };
