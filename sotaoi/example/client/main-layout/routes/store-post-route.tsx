import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { StorePostForm } from '@app/client/main-layout/forms/store-post-form';

interface Props {
  repository: string;
  filters: { [key: string]: any };
}
class StorePostRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    return <StorePostForm filters={params.filters || null} />;
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

export { StorePostRoute };
