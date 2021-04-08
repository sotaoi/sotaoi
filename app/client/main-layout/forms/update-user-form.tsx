import React from 'react';
import { ViewComponent, ViewPromises, ViewData } from '@sotaoi/client/components';
import { FormConstructor, UpdateFormFactory } from '@sotaoi/client/forms';
import { Artifacts, RecordRef } from '@sotaoi/omni/artifacts';
import { getAllCountriesQuery } from '@app/client/queries/country-queries';
import { pushRoute } from '@sotaoi/client/router';
import { getUser } from '@app/client/queries/user-queries';
import { WebUpdateUserForm } from '@app/client/main-layout/forms/update-user-form/web.update-user-form';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { RefSelectField } from '@sotaoi/client/forms/fields/ref-select-field';
import { FileField } from '@sotaoi/client/forms/fields/file-field';
import { getUserUpdateFormValidations } from '@app/client/queries/validation-queries';
import { MultiFileField } from '@sotaoi/client/forms/fields/multi-file-field';

// todo here: (and in any component in general) handle component error
interface UpdateUserFormProps {
  uuid: string;
}
class UpdateUserForm extends ViewComponent<UpdateUserFormProps> {
  public promises(): ViewPromises<UpdateUserFormProps> {
    return {
      countries: getAllCountriesQuery(),
      user: getUser(),
      validations: getUserUpdateFormValidations(),
    };
  }

  public init({ results, props }: ViewData<UpdateUserFormProps>): any {
    const user = results.user.result.record;
    const userCountry = user.address?.country ? new RecordRef('country', user.address.country.uuid) : null;
    const countries = results.countries.result.records;

    const registerUserFormConstructor = FormConstructor(
      {
        email: InputField.input(user.email),
        // add user password change
        avatar: FileField.input(user.avatar),
        gallery: MultiFileField.input(user.gallery),
        address: {
          fields: {
            street: InputField.input(user.address.street),
            country: RefSelectField.input(userCountry),
          },
        },
      },
      results.validations,
    );

    const Form = UpdateFormFactory(null, new Artifacts(), null, 'user', registerUserFormConstructor, props.uuid);
    Form.init();

    React.useEffect(() => (): void => Form.destroy(), []);

    Form.onCommandSuccess(async (result) => {
      if (!result.artifact) {
        throw new Error('something went wrong');
      }
      pushRoute(`/user/view/${result.artifact.uuid}`);
    });

    return {
      form: Form,
      countries,
    };
  }

  public web(data: ViewData<UpdateUserFormProps>): null | React.ReactElement {
    const { form, countries } = this.init(data);
    return <WebUpdateUserForm form={form} countries={countries} />;
  }

  public mobile(): null {
    return null;
  }

  public electron(): null {
    return null;
  }
}

export { UpdateUserForm };
