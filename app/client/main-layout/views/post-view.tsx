import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { getPost } from '@app/client/queries/post-queries';
import _ from 'lodash';

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
    const category = JSON.stringify(post.category);
    const date = new Date(post.createdAt);
    const dateDisplay = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    return (
      <section className="font-sans container m-auto flex flex-col py-8 max-w-xl text-center px-6">
        <label className="text-sm uppercase">{dateDisplay}</label>
        <h1 className="my-8 max-w-full m-auto text-3xl md:text-4xl lg:text-sm font-small">{post.title}</h1>
        <h1 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1"> #{category}</h1>
        <p className="mt-1 lg:mt-4 max-w-lg m-auto leading-loose mb-6 text-left">{post.content}</p>
        <p className="max-w-lg m-auto leading-loose mb-6 text-left">{post.content}</p>
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
