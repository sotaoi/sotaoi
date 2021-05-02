import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { UpdatePostForm } from '@app/client/main-layout/forms/update-post-form';

interface Props {
  uuid: string;
}
class UpdatePostRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    return <UpdatePostForm uuid={params.uuid} />;
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
