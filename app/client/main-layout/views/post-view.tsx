import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { getPost } from '@app/client/queries/post-queries';
import { DateComponent } from '@app/client/components/post-components/date-component';
import { Content } from '@app/client/components/post-components/content';

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

    post.content.replace(/(?:\r\n|\r|\n)/g, '{""}');

    return (
      <section
        style={{ whiteSpace: 'pre-wrap' }}
        className="font-sans container m-auto flex flex-col py-8 max-w-xl text-center px-6"
      >
        <DateComponent date={post.createdAt} />
        <h1 className="my-8 max-w-full m-auto text-3xl md:text-4xl lg:text-sm font-small">{post.title}</h1>
        <h1 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1"> #{post.category}</h1>
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
