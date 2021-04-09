import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { Link } from '@sotaoi/client/router';

interface ViewComponentProps {
  postUuid: string;
  linkText: string;
}
//
class PostLink extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {};
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    return (
      <span className="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0">
        <Link to={`/post/view/${props.postUuid}`}>
          {props.linkText}
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
    );
  }

  public mobile(): null {
    return null;
  }

  public electron(): null {
    return null;
  }
}

export { PostLink };
