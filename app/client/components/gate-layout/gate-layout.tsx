import React from 'react';
import { ScrollView, View } from 'react-native';
import { Link, LayoutProps } from '@sotaoi/client/router';
import { Helper } from '@sotaoi/client/helper';

const GateLayout = (props: LayoutProps): React.ReactElement => {
  if (Helper.isWeb()) {
    return (
      <div>
        <nav className={'flex pl-4 flex-row w-full items-center text-white bg-black shadow'}>
          <Link to={'/'}>
            <h1 className={'m-2 p-2 text-white rounded text-2xl'}>Alarmer</h1>
          </Link>
          <Link to={'/gate/register/user'}>
            <button className={'m-2 p-2 text-white rounded bg-blue-700'}>Sign up</button>
          </Link>
          <Link to={'/gate/auth/user'}>
            <button className={'m-2 p-2 text-white rounded'}>Login</button>
          </Link>
        </nav>
        <div>{props.children}</div>
      </div>
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
