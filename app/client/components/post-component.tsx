import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { getPost } from '../queries/post-queries';

import { PostCardView } from './post-card-view';

interface ViewComponentProps {
  uuid: string;
}
//
class PostComponent extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {
      post: getPost(),
    };
  }
  public web({ results }: ViewData<ViewComponentProps>): null | React.ReactElement {
    const post = results.post.result.record;
    return (
      <>
        <PostCardView
          uuid={post.uuid}
          title={post.title}
          createdAt={post.createdAt}
          category={post.categoryName}
          image={post.image}
        />
      </>
    );
  }

  public mobile(): null {
    return null;
  }

  public electron(): null {
    return null;
  }
}

export { PostComponent };
