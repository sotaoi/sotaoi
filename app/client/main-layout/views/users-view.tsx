import React from 'react';
import { Link } from '@sotaoi/client/router';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { RecordEntry, RecordRef } from '@sotaoi/omni/artifacts';
import { getAllUsersQuery } from '@app/client/queries/user-queries';

interface NoProps {}
class UsersView extends ViewComponent<NoProps> {
  public promises(): ViewPromises<NoProps> {
    return {
      users: getAllUsersQuery(),
    };
  }

  public web({ results, props }: ViewData<NoProps>): null | React.ReactElement {
    const users = results.users.result.records;
    const userList = users.map((user: RecordEntry) => ({
      record: user,
      ref: new RecordRef('user', user.uuid),
    }));

    return (
      <section>
        <h3>Users displayed here</h3>
        {userList.map((user: any) => {
          return (
            <Link key={user.record.uuid} to={`/user/profile/${user.record.uuid}`}>
              <section style={{ margin: '30px' }}>
                <p>uuid: {user.record.uuid}</p>
                email: {user.record.email}
              </section>
            </Link>
          );
        })}
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

export { UsersView };
