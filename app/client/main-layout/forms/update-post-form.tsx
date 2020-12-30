import React from 'react';
import { pushRoute } from '@sotaoi/client/router';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { FormConstructor, UpdateFormFactory } from '@sotaoi/client/forms';
import { RecordEntry, Artifacts } from '@sotaoi/omni/artifacts';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { getAllCategoriesQuery } from '@app/client/queries/category-queries';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { RefSelectField } from '@sotaoi/client/forms/fields/ref-select-field';
import { getPostUpdateFormValidations } from '@app/client/queries/validation-queries';
import { FileField } from '@sotaoi/client/forms/fields/file-field';
import { TextField } from '@sotaoi/client/forms/fields/text-field';
import { getPost } from '@app/client/queries/post-queries';
import { WebUpdatePostForm } from './update-post-form/web.update-post-form';

interface UpdatePostFormProps {
  filters?: { [key: string]: any };
  uuid: string;
}
class UpdatePostForm extends ViewComponent<UpdatePostFormProps> {
  public promises(): ViewPromises<UpdatePostFormProps> {
    return {
      categories: getAllCategoriesQuery(),
      validations: getPostUpdateFormValidations(),
      post: getPost(),
    };
  }

  public init({ results, props }: ViewData<UpdatePostFormProps>): { form: StoreForm; categories: RecordEntry[] } {
    const categories = results.categories.result.records;

    const post = results.post.result.record;
    const updatePostFormConstructor = FormConstructor(
      {
        title: InputField.input(post.title),
        content: TextField.input(post.content),
        category: RefSelectField.input(post.category),
        user: InputField.input(post.createdBy),
        image: FileField.input(post.image),
      },
      results.validations,
    );

    const Form = UpdateFormFactory(null, new Artifacts(), null, 'post', updatePostFormConstructor, props.uuid);
    Form.init();
    React.useEffect(() => (): void => Form.destroy(), []);

    Form.onCommandSuccess(async (result) => {
      if (!result.artifact) {
        throw new Error('something went wrong');
      }
      pushRoute(`/post/view/${result.artifact.uuid}`);
    });

    return { form: Form, categories };
  }

  public web(data: ViewData<UpdatePostFormProps>): null | React.ReactElement {
    const { form, categories } = this.init(data);
    return <WebUpdatePostForm form={form} categories={categories} />;
  }

  public mobile(data: ViewData<UpdatePostFormProps>): null | React.ReactElement {
    return null;
  }

  public electron(data: ViewData<UpdatePostFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { UpdatePostForm };
