import React from 'react';
import { View, Text } from 'react-native';
import { Helper } from '@sotaoi/client/helper';
import { tailwind } from '@sotaoi/client/components/styles';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { UserAboutView } from '../views/user-about-view';
import { store } from '@sotaoi/client/store';
// !!
// import { Button } from '@sotaoi/client/components/button';

interface Props {}
class AboutRoute extends RouteComponent<Props> {
  public display({ params }: RouteData<Props>): null | React.ReactElement {
    const uuidCurrentUser = store().getAuthRecord()?.uuid;
    console.log(uuidCurrentUser);
    return <UserAboutView uuid={store().getAuthRecord()?.uuid} />;
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

export { AboutRoute };
