import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';
import { Link } from '@sotaoi/client/router';

interface ViewComponentProps {
  uuid: string;
  title: string;
  createdAt: string;
  category: string;
}

class PostComponent extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {
      // post: getPost(),
    };
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    const post = props;
    const date = new Date(post.createdAt);

    const dateToPrint = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return (
      <section key={post.uuid}>
        <div className={'p-4 md:w-1/3'}>
          <div className="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              className="lg:h-48 md:h-36 w-full object-cover object-center"
              src="https://dummyimage.com/400x200/"
              alt="blog"
            />
            <div className="p-6">
              <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">#{post.category}</h2>
              <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{post.title}</h1>
              <p className="leading-relaxed mb-3">{dateToPrint}</p>
              <div className="flex items-center flex-wrap ">
                <span className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">
                  <Link to={`/post/view/${post.uuid}`}>
                    Read more
                    <span className="inline-flex">
                      <svg
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </Link>
                </span>
              </div>
            </div>
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

export { PostComponent };
