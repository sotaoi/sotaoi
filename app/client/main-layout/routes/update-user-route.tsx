import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { UpdateUserForm } from '@app/client/main-layout/forms/update-user-form';
import { ErrorComponent } from '@app/client/components/error-component';

interface Props {
  uuid: string;
}
class UpdateUserRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    try {
      return <UpdateUserForm uuid={params.uuid} />;
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

export { UpdateUserRoute };
