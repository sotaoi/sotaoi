import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { getPost } from '@app/client/queries/post-queries';
import { DateComponent } from '@app/client/components/post-components/date-component';
import { PostLink } from '@app/client/components/post-components/post-link';

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
        <div key={post.uuid} className={'flex-1 lg:w-1/2 p-4 md:w-1/3'}>
          <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src={`${this.asset(post.image)}`}
              alt="blog"
            />

            <div className="p-6">
              <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">#{post.category}</h2>
              <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{post.title}</h1>
              <DateComponent date={post.createdAt} />
              <div className="flex items-center flex-wrap ">
                <PostLink postUuid={post.uuid} linkText={'Read More'} />{' '}
              </div>
            </div>
          </div>
        </div>
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
