import React from 'react';
import { pushRoute } from '@sotaoi/client/router';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { StoreFormFactory, FormConstructor } from '@sotaoi/client/forms';
import { RecordEntry, RecordRef, Artifacts } from '@sotaoi/omni/artifacts';
import { getAllCountriesQuery } from '@app/client/queries/country-queries';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { WebRegisterUserForm } from '@app/client/gate-layout/forms/register-user-form/web.register-user-form';
import { MobileRegisterUserForm } from '@app/client/gate-layout/forms/register-user-form/mobile.register-user-form';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { RefSelectField } from '@sotaoi/client/forms/fields/ref-select-field';
import { FileField } from '@sotaoi/client/forms/fields/file-field';
import { MultiFileField } from '@sotaoi/client/forms/fields/multi-file-field';
import { getUserCommandFormValidations } from '@app/client/queries/validation-queries';

interface RegisterUserFormProps {
  filters: { [key: string]: any };
}
class RegisterUserForm extends ViewComponent<RegisterUserFormProps> {
  public promises(): ViewPromises<RegisterUserFormProps> {
    return {
      countries: getAllCountriesQuery(),
      validations: getUserCommandFormValidations(),
    };
  }

  public init({ results, props }: ViewData<RegisterUserFormProps>): { form: StoreForm; countries: RecordEntry[] } {
    const countries = results.countries.result.records;

    const RegisterUserFormConstructor = FormConstructor(
      {
        email: InputField.input(''),
        password: InputField.input(''),
        avatar: FileField.input(null),
        gallery: MultiFileField.input([]),
        address: {
          fields: {
            street: InputField.input(''),
            country: RefSelectField.input(new RecordRef('country', countries[0].uuid)),
          },
          values: {},
        },
      },
      results.validations,
    );
    const Form = StoreFormFactory(null, new Artifacts(), null, 'user', RegisterUserFormConstructor);
    Form.init();

    Form.onCommandSuccess(async (result) => {
      if (!result.ref) {
        throw new Error('something went wrong');
      }
      pushRoute(`/gate/auth/user`);
    });

    React.useEffect(() => (): void => Form.destroy(), []);

    return { form: Form, countries };
  }

  public web(data: ViewData<RegisterUserFormProps>): null | React.ReactElement {
    const { form, countries } = this.init(data);
    return <WebRegisterUserForm form={form} countries={countries} />;
  }

  public mobile(data: ViewData<RegisterUserFormProps>): null | React.ReactElement {
    return <MobileRegisterUserForm {...this.init(data)} />;
  }

  public electron(data: ViewData<RegisterUserFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { RegisterUserForm };
