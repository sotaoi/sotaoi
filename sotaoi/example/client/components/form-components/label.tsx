import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';

interface ViewComponentProps {
  labelText: string;
  className: string;
}
class Label extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {};
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    return (
      <>
        <label className={props.className}>{props.labelText}</label>
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

export { Label };
