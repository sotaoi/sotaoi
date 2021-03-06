import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { StoreFormFactory, FormConstructor } from '@sotaoi/client/forms';
// import { RecordEntry, RecordRef, Artifacts, AuthRecord } from '@sotaoi/omni/artifacts';
import { Artifacts, AuthRecord } from '@sotaoi/omni/artifacts';
// import { getAllCountriesQuery } from '@app/client/queries/country-queries';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { WebRegisterUserForm } from '@app/client/components/gate-layout/forms/register-user-form/web.register-user-form';
import { MobileRegisterUserForm } from '@app/client/components/gate-layout/forms/register-user-form/mobile.register-user-form';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
// import { RefSelectField } from '@sotaoi/client/forms/fields/ref-select-field';
// import { StringSelectField } from '@sotaoi/client/forms/fields/string-select-field';
import { FileField } from '@sotaoi/client/forms/fields/file-field';
// import { MultiFileField } from '@sotaoi/client/forms/fields/multi-file-field';
import { getUserStoreFormValidations } from '@app/client/queries/validation-queries';
import { store } from '@sotaoi/client/store';

interface RegisterUserFormProps {
  filters: { [key: string]: any };
}
class RegisterUserForm extends ViewComponent<RegisterUserFormProps> {
  public promises(): ViewPromises<RegisterUserFormProps> {
    return {
      // countries: getAllCountriesQuery(),
      validations: getUserStoreFormValidations(),
    };
  }

  // public init({ results, props }: ViewData<RegisterUserFormProps>): { form: StoreForm; countries: RecordEntry[]; } {
  public init({ results, props }: ViewData<RegisterUserFormProps>): { form: StoreForm } {
    // const countries = results?.countries?.records || [];
    // if (!countries.length) {
    //   throw new Error('No country found');
    // }

    const RegisterUserFormConstructor = FormConstructor(
      {
        email: InputField.input(''),
        password: InputField.input(''),
        avatar: FileField.input(null),
        // gallery: MultiFileField.input([]),
        // address: {
        //   fields: {
        //     street: InputField.input(''),
        //     country: RefSelectField.input(new RecordRef('country', countries[0].uuid)),
        //   },
        //   values: {},
        // },
      },
      results.validations,
    );
    const Form = StoreFormFactory(null, new Artifacts(), null, 'user', RegisterUserFormConstructor);
    Form.init();

    Form.onCommandSuccess(async (result) => {
      if (!result.artifact) {
        throw new Error('something went wrong');
      }
      const artifact = result.artifact as AuthRecord;
      const authRecord = new AuthRecord(artifact.repository, artifact.uuid, artifact.createdAt, artifact.active);
      await store().setAuthRecord(authRecord, artifact.pocket.accessToken);
    });

    React.useEffect(() => (): void => Form.destroy(), []);

    // return { form: Form, countries };
    return { form: Form };
  }

  public web(data: ViewData<RegisterUserFormProps>): null | React.ReactElement {
    // const { form, countries } = this.init(data);
    const { form } = this.init(data);
    // return <WebRegisterUserForm form={form} countries={countries} />;
    return <WebRegisterUserForm form={form} />;
  }

  public mobile(data: ViewData<RegisterUserFormProps>): null | React.ReactElement {
    const { form } = this.init(data);
    // return <MobileRegisterUserForm form={form} countries={countries} />;
    return <MobileRegisterUserForm form={form} />;
  }

  public electron(data: ViewData<RegisterUserFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { RegisterUserForm };
