import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { PostView } from '@app/client/main-layout/views/post-view';

interface Props {
  uuid: string;
}
class PostRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    return <PostView uuid={params.uuid} />;
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

export { PostRoute };
