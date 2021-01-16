import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
// import { getAllCategoriesQuery } from '@app/client/queries/category-queries';
import { getAllPostsQuery } from '@app/client/queries/post-queries';
import { PostCardView } from './post-card-view';

interface ViewComponentProps {
  //
}
class PostsView extends ViewComponent<ViewComponentProps> {
  public promises(): ViewPromises<ViewComponentProps> {
    return {
      posts: getAllPostsQuery(),
      // categories: getAllCategoriesQuery(),
    };
  }

  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    const posts = results.posts.result.records;
    // const categories = results.categories.result.records;
    return (
      <section className="text-gray-700 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {posts.map((post: any) => (
              <PostCardView
                key={post.uuid}
                uuid={post.uuid}
                title={post.title}
                createdAt={post.createdAt}
                category={post.categoryName}
                image={post.image}
              />
            ))}
          </div>
        </div>
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

export { PostsView };
