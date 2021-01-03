import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { DateComponent } from '@app/client/components/post-components/date-component';
import { PostLink } from '@app/client/components/post-components/post-link';
import { Category } from '@app/client/components/post-components/category';

interface ViewComponentProps {
  uuid: string;
  category: string;
  title: string;
  createdAt: string;
  image: string;
}
//
class PostCardView extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {};
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    const image = this.asset(props.image);
    return (
      <>
        <div key={props.uuid} className={'flex-1 lg:w-1/2 p-4 md:w-1/3'}>
          <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center ease-in border-b-2"
              src={`${image}`}
              alt="blog"
            />

            <div className="p-6">
              <Category categoryName={props.category} />
              <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{props.title}</h1>
              <DateComponent date={props.createdAt} />
              <div className="flex items-center flex-wrap ">
                <PostLink postUuid={props.uuid} linkText={'Read More'} />{' '}
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

export { PostCardView };
