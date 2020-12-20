import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { getUser } from '@app/client/queries/user-queries';
import { Link } from '@sotaoi/client/router';
import { store } from '@sotaoi/client/store';

interface UserViewProps {
  uuid: string;
}
class UserView extends ViewComponent<UserViewProps> {
  public promises(): ViewPromises<UserViewProps> {
    return {
      user: getUser(),
    };
  }

  public web({ results, props }: ViewData<UserViewProps>): null | React.ReactElement {
    const user = results.user.result.record;
    return (
      <section>
        <Link to={`/user/edit/${props.uuid}`}>
          <button type={'button'} style={{ marginBottom: 20, marginTop: 20 }}>
            update
          </button>
        </Link>
        <section>{JSON.stringify(user)}</section>
      </section>
    );
  }

  public mobile(): null {
    return null;
  }

  public electron(): null {
    return null;
  }
}

export { UserView };
