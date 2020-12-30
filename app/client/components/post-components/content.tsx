import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import _ from 'lodash';

interface ViewComponentProps {
  content: string;
}
//
class Content extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {};
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    // props.content.replace(/(?:\r\n|\r|\n)/g, '{""}');

    return (
      <>
        <p
          style={{ lineHeight: '0.5 rem', whiteSpace: 'pre-wrap' }}
          className="max-w-lg m-auto leading-loose mb-6 text-left"
        >
          {props.content}
        </p>
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

export { Content };
