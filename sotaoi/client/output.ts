import { BaseField } from '@sotaoi/client/forms/fields/base-field';
import { SingleCollectionField, CollectionField } from '@sotaoi/client/forms/fields/collection-field';
import _ from 'lodash';
import { Helper, TransformerFn } from '@sotaoi/client/helper';
import { Output as OmniOutput } from '@sotaoi/omni/output';

class Output extends OmniOutput {
  public static getTouchFieldsTransformer() {
    return (item: any, prefix: string, transformer: TransformerFn, prop: string): any => {
      const key = prefix ? `${prefix}.${prop}` : prop;
      switch (true) {
        case item instanceof SingleCollectionField:
        case item instanceof CollectionField:
          // multi collection
          if (item.fields instanceof Array) {
            item.fields.map((field: any, index: string) =>
              transformer(field, `${key}.fields.${index.toString()}`, this.getTouchFieldsTransformer(), ''),
            );
            return item;
          }
          // single collection
          transformer(item.fields, `${key}.fields`, this.getTouchFieldsTransformer(), '');
          return item;
        // single field
        case item instanceof BaseField:
          item.setTouched(true);
          return item;
        default:
          Helper.iterate(item, `${key}`, this.getTouchFieldsTransformer());
          return item;
      }
    };
  }

  public static getFieldTransformer(skipUnchanged: boolean) {
    return (item: any, prefix: string, transformer: TransformerFn, prop: string): any => {
      const key = prefix ? `${prefix}.${prop}` : prop;
      switch (true) {
        case item instanceof SingleCollectionField:
        case item instanceof CollectionField:
          // multi collection
          if (item.fields instanceof Array) {
            return item.fields.map((field: any, index: string) =>
              transformer(field, `${key}.fields.${index.toString()}`, this.getFieldTransformer(skipUnchanged), ''),
            );
          }
          // single collection
          return transformer(item.fields, `${key}.fields`, this.getFieldTransformer(skipUnchanged), '');
        // single field
        case item instanceof BaseField:
          if (skipUnchanged && !item.wasChanged() && this.ALLOW_SKIP_UNCHANGED) {
            return;
          }
          return item.value !== null ? item.value.serialize() : null;
        default:
          return Helper.iterate(item, `${key}`, this.getFieldTransformer(skipUnchanged));
      }
    };
  }
}

export { Output };
