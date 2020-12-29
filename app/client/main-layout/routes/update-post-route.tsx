import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { ErrorComponent } from '@app/client/components/error-component';
import { UpdatePostForm } from '../forms/update-post-form';

interface Props {
  uuid: string;
}
class UpdatePostRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    try {
      return <UpdatePostForm uuid={params.uuid} />;
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

export { UpdatePostRoute };
