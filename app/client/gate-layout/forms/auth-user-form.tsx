import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { AuthFormFactory, FormConstructor } from '@sotaoi/client/forms';
import { Artifacts } from '@sotaoi/omni/artifacts';
import { AuthForm } from '@sotaoi/client/forms/form-classes/auth-form';
import { WebAuthUserForm } from '@app/client/gate-layout/forms/auth-user-form/web.auth-user-form';
import { MobileAuthUserForm } from '@app/client/gate-layout/forms/auth-user-form/mobile.auth-user-form';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { getAuthUserFormValidations } from '@app/client/queries/validation-queries';

interface AuthUserFormProps {}
class AuthUserForm extends ViewComponent<AuthUserFormProps> {
  public promises(): ViewPromises<AuthUserFormProps> {
    return {
      validations: getAuthUserFormValidations(),
    };
  }

  public init({ results, props }: ViewData<AuthUserFormProps>): { form: AuthForm } {
    const authUserFormConstructor = FormConstructor(
      {
        email: InputField.input(''),
        password: InputField.input(''),
      },
      results.validations,
    );

    const Form = AuthFormFactory(new Artifacts(), 'user', authUserFormConstructor, 'test:password:email:username');
    Form.init();

    React.useEffect(() => {
      return (): void => {
        Form.destroy();
      };
    }, []);

    Form.onAuthSuccess(async (result) => {
      // do nothing (will be redirected by router rules)
    });

    return { form: Form };
  }

  public web(data: ViewData<AuthUserFormProps>): null | React.ReactElement {
    return <WebAuthUserForm {...this.init(data)} />;
  }

  public mobile(data: ViewData<AuthUserFormProps>): null | React.ReactElement {
    return <MobileAuthUserForm {...this.init(data)} />;
  }

  public electron(data: ViewData<AuthUserFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { AuthUserForm };
