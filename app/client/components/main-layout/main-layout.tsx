import React from 'react';
import { Link, LayoutProps } from '@sotaoi/client/router';
import { Action } from '@sotaoi/client/action';
import { Helper } from '@sotaoi/client/helper';
import { View, Text } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { store } from '@sotaoi/client/store';
import { useTranslation } from 'react-i18next';

const MainLayout = (props: LayoutProps): React.ReactElement => {
  const { t } = useTranslation();

  const authRecord = store().getAuthRecord();
  if (Helper.isWeb()) {
    return (
      <div>
        <nav className={'flex pl-4 flex-row row w-full items-center text-white bg-black shadow'}>
          <div className={'flex-grow'} style={{}}>
            <Link to={'/'}>
              <h1 className={'m-2 p-2 inline-block text-white rounded text-2xl'}>{t('app.general.welcome')}</h1>
            </Link>
            <Link to={'/todo'}>
              <button className={'m-2 p-2 text-white rounded'}>My Alarms</button>
            </Link>
            <Link to={'/user/list/all'}>
              <button className={'m-2 p-2 text-white rounded'}>Users</button>
            </Link>
            {authRecord && (
              <Link to={`/${authRecord.repository}/view/${authRecord.uuid}`}>
                <button className={'m-2 p-2 text-white rounded'}>My Profile</button>
              </Link>
            )}
          </div>
          <div>
            <Link to={'/gate/auth/user'}>
              <button
                onClick={async (): Promise<void> => {
                  await Action.deauth();
                }}
                className={'m-2 p-2 text-white rounded'}
              >
                Logout
              </button>
            </Link>
          </div>
        </nav>
        <div>{props.children}</div>
      </div>
    );
  }
  if (Helper.isMobile()) {
    // todo lowprio: mobile view
    throw new Error('mobile not implemented');
    // return (
    //   <ScrollView>
    //     {/*  */}

    //     <View style={{ margin: 15 }}>
    //       <Link to={'/'}>Alarmer</Link>
    //     </View>
    //     {/* <h2 style={{ margin: 15 }}>Main Layout</h2> */}
    //     <View style={{ margin: 15 }}>
    //       <Link to={'/user/list/all'}>Users</Link>
    //     </View>
    //     <View style={{ margin: 15 }}>
    //       <TouchableOpacity
    //         onPressOut={async (): Promise<void> => {
    //           await Action.deauth();
    //         }}
    //       >
    //         <Text>Logout</Text>
    //       </TouchableOpacity>
    //     </View>

    //     {props.children}

    //     {/*  */}
    //   </ScrollView>
    // );
  }

  if (Helper.isElectron()) {
    throw new Error('electron not implemented');
  }

  throw new Error('unknown environment');
};

export { MainLayout };
