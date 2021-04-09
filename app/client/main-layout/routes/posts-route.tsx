import React from 'react';
import { ViewPromises, RouteComponent, RouteData } from '@sotaoi/client/components';
import { getAllCategoriesQuery } from '@app/client/queries/category-queries';
import { PostsView } from '@app/client/components/posts-view';
import { getAllPostsQuery } from '@app/client/queries/post-queries';

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
