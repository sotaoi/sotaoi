import React from 'react';
import { View, Text } from 'react-native';
import { Link } from '@sotaoi/client/router';
import { Errors } from '@app/client/errors';
import { Helper } from '@sotaoi/client/helper';

const ErrorComponent = (props: { error: Error }): null | React.ReactElement => {
  switch (true) {
    case Helper.isWeb():
      switch (true) {
        // gate errors
        case props.error instanceof Errors.InvalidRegisterRepository:
          return <section>Error: invalid register repository</section>;

        // generic errors
        case props.error instanceof Errors.NotFoundView:
          return (
            <section>
              <h2>Not Found</h2>
              <section>We did not find what you were looking for</section>
            </section>
          );
        case props.error instanceof Errors.ComponentFail:
          return <section>Error encountered</section>;
        case props.error instanceof Errors.NotFoundLayout:
        default:
          return (
            <section style={{ display: 'flex', flex: 1, fontSize: 75, justifyContent: 'center', alignItems: 'center' }}>
              <Link to={'/'}>???</Link>
            </section>
          );
      }
    case Helper.isMobile():
      return (
        <View style={{ flex: 1 }}>
          <Text>???</Text>
        </View>
      );
    case Helper.isElectron():
      // nothing here yet
      return null;
    default:
      throw new Error('unknown environment');
  }
};

export { ErrorComponent };
