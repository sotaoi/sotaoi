import React from 'react';
import { ScrollView, View } from 'react-native';
import { Link, LayoutProps } from '@sotaoi/client/router';
import { Helper } from '@sotaoi/client/helper';

const GateLayout = (props: LayoutProps): React.ReactElement => {
  if (Helper.isWeb()) {
    return (
      <section>
        <nav
          className={
            'font-sans text-white flex mt-0 ml-0 mb-0 flex-col sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-black shadow sm:items-baseline w-full'
          }
        >
          <div className="mb-2 sm:mb-0">
            <span className={'text-2xl no-underline text-grey-darkest hover:text-blue-dark'}>
              <Link to={'/'}>Alarmer</Link>
            </span>
            <span
              className={
                'bg-blue-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded no-underline text-grey-darkest hover:text-blue-dark ml-2'
              }
            >
              <Link to={'/gate/register/user'}>Sign Up</Link>
            </span>
            <span className={'text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2'}>
              <Link to={'/gate/auth/user'}>Login</Link>
            </span>
          </div>
        </nav>
        <div>{props.children}</div>
      </section>
    );
  }

  if (Helper.isMobile()) {
    return (
      <ScrollView>
        {/*  */}

        <View style={{ margin: 15 }}>
          <Link to={'/'}>Alarmer</Link>
        </View>
        {/* <h2>Gate Layout</h2> */}
        <View style={{ margin: 15 }}>
          <Link to={'/gate/register/user'}>Go To Register</Link>
        </View>
        <View style={{ margin: 15 }}>
          <Link to={'/gate/auth/user'}>Login</Link>
        </View>
        {props.children}

        {/*  */}
      </ScrollView>
    );
  }

  if (Helper.isElectron()) {
    throw new Error('electron not implemented');
  }

  throw new Error('unknown environment');
};

export { GateLayout };
