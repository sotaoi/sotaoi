import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { UserAboutView } from '@app/client/main-layout/views/user-about-view';
// !!
// import { Button } from '@sotaoi/client/components/button';

interface Props {
  uuid: string;
}
class HomeUserRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    return <UserAboutView uuid={params.uuid} />;
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

export { HomeUserRoute };
