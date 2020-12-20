import React from 'react';
import { RouteComponent, RouteData } from '@sotaoi/client/components';
import { ErrorComponent } from '@app/client/components/error-component';
import { TaskUserForm } from '@app/client/main-layout/forms/task-user-form';

class TaskUserRoute extends RouteComponent<RouteData> {
  public display(props: RouteData): null | React.ReactElement {
    try {
      return <TaskUserForm />;
    } catch (err) {
      console.warn(err);
      return <ErrorComponent error={err} />;
    }
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
