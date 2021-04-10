import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { TaskUserForm } from '@app/client/main-layout/forms/task-user-form';

class TaskUserRoute extends RouteComponent<RouteData> {
  public display(props: RouteData): null | React.ReactElement {
    return <TaskUserForm />;
  }
  public web(props: RouteData): null | React.ReactElement {
    return this.display(props);
  }

  public mobile(props: RouteData): null | React.ReactElement {
    return this.display(props);
  }

  public electron(props: RouteData): null | React.ReactElement {
    return this.display(props);
  }
}

export { TaskUserRoute };
