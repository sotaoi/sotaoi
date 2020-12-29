import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { getPost } from '@app/client/queries/post-queries';
import { DateComponent } from '@app/client/components/post-components/date-component';
import { Content } from '@app/client/components/post-components/content';
import { Category } from '@app/client/components/post-components/category';

interface ViewComponentProps {
  uuid: string;
}
class PostView extends ViewComponent<ViewComponentProps> {
  public promises(): ViewPromises<ViewComponentProps> {
    return {
      post: getPost(),
    };
  }

  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    const post = results.post.result.record;

    console.log(post.category);
    return (
      <section
        style={{ whiteSpace: 'pre-wrap' }}
        className="font-sans container m-auto flex flex-col py-8 max-w-xl text-center px-6"
      >
        <DateComponent date={post.createdAt} />
        <h1 className="my-8 max-w-full m-auto text-3xl md:text-4xl lg:text-sm font-small">{post.title}</h1>
        <Category categoryName={post.category} />
        <img src={`${this.asset(post.image)}`} />
        <Content content={post.content} />
        <p className="max-w-lg m-auto leading-loose mb-6 text-left">by {post.userName}</p>
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

export { PostView };
