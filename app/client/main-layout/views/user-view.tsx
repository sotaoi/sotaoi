import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { getUser } from '@app/client/queries/user-queries';
import { Link } from '@sotaoi/client/router';

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
    const avatar = this.asset(user.avatar);
    const gallery = this.assets(user.gallery);
    return (
      <section style={{ padding: 15 }}>
        <Link to={`/user/edit/${props.uuid}`}>
          <button type={'button'}>update</button>
        </Link>
        <hr />
        <section>email: {user.email}</section>
        <hr />
        <section>
          avatar:
          {!!avatar && <img src={avatar} style={{ maxWidth: 200, maxHeight: 200 }} />}
        </section>
        <hr />
        {!!gallery && (
          <React.Fragment>
            <section>
              gallery:
              {gallery.map((galleryItem: string, index: number) => (
                <img key={galleryItem + index} src={galleryItem} style={{ maxWidth: 200, maxHeight: 200 }} />
              ))}
            </section>
            <hr />
          </React.Fragment>
        )}
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
