import React from 'react';
import { pushRoute } from '@sotaoi/client/router';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { StoreFormFactory, FormConstructor } from '@sotaoi/client/forms';
import { RecordEntry, RecordRef, Artifacts } from '@sotaoi/omni/artifacts';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { WebStorePostForm } from '@app/client/main-layout/forms/store-post-form/web.store-post-form';
import { getAllCategoriesQuery } from '@app/client/queries/category-queries';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { RefSelectField } from '@sotaoi/client/forms/fields/ref-select-field';
import { getPostFormValidations } from '@app/client/queries/validation-queries';
import { FileField } from '@sotaoi/client/forms/fields/file-field';
import { store } from '@sotaoi/client/store';
import { TextField } from '@sotaoi/client/forms/fields/text-field';

interface StorePostFormProps {
  filters?: { [key: string]: any };
}
class StorePostForm extends ViewComponent<StorePostFormProps> {
  public promises(): ViewPromises<StorePostFormProps> {
    return {
      categories: getAllCategoriesQuery(),
      validations: getPostFormValidations(),
    };
  }

  public init({ results, props }: ViewData<StorePostFormProps>): { form: StoreForm; categories: RecordEntry[] } {
    const categories = results.categories.records;
    const userUuid = store().getAuthRecord()?.uuid;
    const storePostFormConstructor = FormConstructor(
      {
        title: InputField.input(''),
        content: TextField.input(''),
        category: RefSelectField.input(new RecordRef('category', categories[0].uuid)),
        user: InputField.input(new RecordRef('user', userUuid ?? '').serialize(null)),
        image: FileField.input(null),
      },
      results.validations,
    );

    const Form = StoreFormFactory(null, new Artifacts(), null, 'post', storePostFormConstructor);
    Form.init();

    Form.onCommandSuccess(async (result) => {
      if (!result.artifact) {
        throw new Error('something went wrong');
      }
      pushRoute(`/post/view/${result.artifact.uuid}`);
    });

    React.useEffect(() => (): void => Form.destroy(), []);

    return { form: Form, categories };
  }

  public web(data: ViewData<StorePostFormProps>): null | React.ReactElement {
    const { form, categories } = this.init(data);
    return <WebStorePostForm form={form} categories={categories} />;
  }

  public mobile(data: ViewData<StorePostFormProps>): null | React.ReactElement {
    return null;
  }

  public electron(data: ViewData<StorePostFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { StorePostForm };
