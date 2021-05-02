import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';

interface ViewComponentProps {
  date: string;
}
//
class DateComponent extends ViewComponent<ViewComponentProps> {
  promises(): ViewPromises<ViewComponentProps> {
    return {};
  }
  public web({ results, props }: ViewData<ViewComponentProps>): null | React.ReactElement {
    const dateTime = new Date(props.date);
    const dateToPrint = dateTime.getDate() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getFullYear();
    return (
      <>
        <p className="leading-relaxed mb-3">{dateToPrint}</p>
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

export { DateComponent };
