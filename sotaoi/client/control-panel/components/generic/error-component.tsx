import React from 'react';
import { Errors } from '@sotaoi/omni/errors';

const ErrorComponent = (props: { error: Error }): null | React.ReactElement => {
  switch (true) {
    case props.error instanceof Errors.NotFoundView:
      return (
        <section className={'p-4'}>
          <h3>Not Found</h3>
          <hr />
          <p>We did not find what you were looking for</p>
        </section>
      );
    case props.error instanceof Errors.ComponentFail:
      return <section>Error encountered</section>;
    case props.error instanceof Errors.NotFoundLayout:
    default:
      return (
        <section className={'p-4'}>
          <h3>This is fatal</h3>
          <hr />
          <p>{JSON.stringify(props.error)}</p>
        </section>
      );
  }
};

export { ErrorComponent };
