import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { Errors } from '@app/client/errors';
import { ErrorComponent } from '@app/client/components/error-component';
import { RegisterUserForm } from '@app/client/gate-layout/forms/register-user-form';

interface Props {
  repository: string;
  filters: { [key: string]: any };
}
class RegisterUserRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    try {
      if (['user'].indexOf(params.repository) === -1) {
        throw new Errors.InvalidRegisterRepository();
      }

      return <RegisterUserForm filters={params.filters || null} />;
    } catch (err) {
      console.warn(err);
      return <ErrorComponent error={err} />;
    }
  }
  public web(props: RouteData<Props>): null | React.ReactElement {
    return this.display(props);
  }

  public mobile(props: RouteData<Props>): null | React.ReactElement {
    return this.display(props);
  }

  public electron(props: RouteData<Props>): null | React.ReactElement {
    return this.display(props);
  }
}

export { RegisterUserRoute };
