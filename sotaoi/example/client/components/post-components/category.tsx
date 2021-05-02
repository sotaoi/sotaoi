import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';

interface ViewComponentProps {
  categoryName: string;
}
class Category extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {};
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    return (
      <>
        <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">#{props.categoryName}</h2>
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

export { Category };
