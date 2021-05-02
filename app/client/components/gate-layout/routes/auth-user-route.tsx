import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { Errors } from '@app/client/errors';
import { AuthUserForm } from '@app/client/components/gate-layout/forms/auth-user-form';

interface Props {
  repository: string;
}
class AuthUserRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    if (['user'].indexOf(params.repository) === -1) {
      throw new Errors.InvalidRegisterRepository();
    }
    return <AuthUserForm />;
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

export { AuthUserRoute };
