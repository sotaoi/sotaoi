import React from 'react';
import { pushRoute } from '@sotaoi/client/router';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { StoreFormFactory, FormConstructor } from '@sotaoi/client/forms';
import { RecordEntry, RecordRef, Artifacts } from '@sotaoi/omni/artifacts';
import { getAllCountriesQuery } from '@app/client/queries/country-queries';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { WebStoreUserForm } from '@app/client/gate-layout/forms/store-user-form/web.store-user-form';
import { MobileStoreUserForm } from '@app/client/gate-layout/forms/store-user-form/mobile.store-user-form';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { RefSelectField } from '@sotaoi/client/forms/fields/ref-select-field';
import { FileField } from '@sotaoi/client/forms/fields/file-field';
import { getUserCommandFormValidations } from '@app/client/queries/validation-queries';

interface StoreUserFormProps {
  filters: { [key: string]: any };
}
class StoreUserForm extends ViewComponent<StoreUserFormProps> {
  public promises(): ViewPromises<StoreUserFormProps> {
    return {
      countries: getAllCountriesQuery(),
      validations: getUserCommandFormValidations(),
    };
  }

  public init({ results, props }: ViewData<StoreUserFormProps>): { form: StoreForm; countries: RecordEntry[] } {
    const countries = results.countries.result.records;

    const storeUserFormConstructor = FormConstructor(
      {
        email: InputField.input(''),
        password: InputField.input(''),
        avatar: FileField.input(null),
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
    const Form = StoreFormFactory(null, new Artifacts(), null, 'user', storeUserFormConstructor);
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

  public web(data: ViewData<StoreUserFormProps>): null | React.ReactElement {
    const { form, countries } = this.init(data);
    return <WebStoreUserForm form={form} countries={countries} />;
  }

  public mobile(data: ViewData<StoreUserFormProps>): null | React.ReactElement {
    return <MobileStoreUserForm {...this.init(data)} />;
  }

  public electron(data: ViewData<StoreUserFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { StoreUserForm };
