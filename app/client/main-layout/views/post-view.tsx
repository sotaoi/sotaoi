import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { getPost } from '@app/client/queries/post-queries';
import { DateComponent } from '@app/client/components/post-components/date-component';
import { Content } from '@app/client/components/post-components/content';
import { Category } from '@app/client/components/post-components/category';
import { Link } from '@sotaoi/client/router';

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

    return (
      <section className="font-sans container m-auto flex flex-col py-8 max-w-xl text-center px-6">
        <DateComponent date={post.createdAt} />
        <h1 className="my-4 max-w-full m-auto text-3xl md:text-4xl lg:text-sm font-small">{post.title}</h1>{' '}
        <Link to={`/post/edit/${props.uuid}`}>
          <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Edit{' '}
          </button>
        </Link>{' '}
        <p className="max-w-lg m-auto leading-loose mb-1 text-left">by {post.userName}</p>
        <Category categoryName={post.categoryName} />
        <img className="py-4 w-full object-cover object-center ease-in" src={`${this.asset(post.image)}`} />
        <Content content={post.content} />
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
