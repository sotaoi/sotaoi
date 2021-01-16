import React from 'react';
import { ViewData, ViewPromises, RouteComponent, RouteData } from '@sotaoi/client/components';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { getAllCategoriesQuery } from '@app/client/queries/category-queries';
import _ from 'lodash';
import { PostsView } from '@app/client/components/posts-view';
// import { Link } from '@sotaoi/client/router';
// import { Helper } from '@sotaoi/client/helper';
import { getAllPostsQuery } from '@app/client/queries/post-queries';
// import { PostCardView } from '@app/client/components/post-card-view';

// michael::TODO figure out how to display the category on a post with a ref
interface NoProps {}
class PostsRoute extends RouteComponent<NoProps> {
  public promises(): ViewPromises<NoProps> {
    return { posts: getAllPostsQuery(), categories: getAllCategoriesQuery() };
  }

  //to-do fix grid view ratios
  public web(data: RouteData<NoProps>): null | React.ReactElement {
    return <PostsView />;
  }

  public mobile(data: RouteData<NoProps>): null | React.ReactElement {
    return null;
  }

  public electron(data: RouteData<NoProps>): null | React.ReactElement {
    return null;
  }
}

export { PostsRoute };
