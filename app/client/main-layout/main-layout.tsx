import React from 'react';
import { Link, LayoutProps, pushRoute } from '@sotaoi/client/router';
import { Action } from '@sotaoi/client/action';
import { Helper } from '@sotaoi/client/helper';
import { View, Text } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';

const MainLayout = (props: LayoutProps): React.ReactElement => {
  if (Helper.isWeb()) {
    return (
      <section>
        <nav
          className={
            'flex text-white items-center justify-between flex-wrap bg-teal py-4 px-6 bg-black shadow sm:items-baseline w-full'
          }
        >
          <div className="mt-1 ml-2 mb-0 sm:mb-0">
            <span className={'text-2xl no-underline text-grey-darkest hover:text-blue-dark'}>
              <Link to={'/'}>MONOlogz</Link>
            </span>
            <span className={'text-lg no-underline text-grey-darkest hover:text-blue-dark ml-3'}>
              <Link to={'/post/list/all'}>Posts</Link>
            </span>
            <span className={'text-lg no-underline text-grey-darkest hover:text-blue-dark ml-3'}>
              <Link to={'/user/list/all'}>Users</Link>
            </span>
            <span className={'text-lg no-underline text-grey-darkest hover:text-blue-dark ml-3'}>
              <Link to={'/user/profile'}>Profile/About</Link>
            </span>
            <span className={'text-lg no-underline text-grey-darkest hover:text-blue-dark ml-3'}>
              <Link to={'/post/store'}>Add post</Link>
            </span>
            <span className={'text-lg no-underline text-grey-darkest hover:text-blue-dark ml-3'}>
              <Link to={'/user/hello-task'}>User Task</Link>
            </span>
          </div>
          <div></div>

          <div>
            <span className={'text-lg justify-right no-underline text-grey-darkest hover:text-blue-dark ml-2'}>
              <button
                type={'button'}
                onClick={async (): Promise<void> => {
                  await Action.deauth();
                }}
              >
                Logout
              </button>
            </span>
          </div>
        </nav>

        <section>{props.children}</section>
      </section>
    );
  }
  if (Helper.isMobile()) {
    return (
      <ScrollView>
        {/*  */}

        <View style={{ margin: 15 }}>
          <Link to={'/'}>MONOlogz</Link>
        </View>
        {/* <h2 style={{ margin: 15 }}>Main Layout</h2> */}
        <View style={{ margin: 15 }}>
          <Link to={'/post/list/all'}>Posts</Link>
        </View>
        <View style={{ margin: 15 }}>
          <Link to={'/user/list/all'}>Users</Link>
        </View>
        {/* <View style={{ margin: 15 }}>
          <Link to={'/user/hello-task'}>User Task</Link>
        </View> */}
        <View style={{ margin: 15 }}>
          <Link to={'/post/store'}>Add post</Link>
        </View>
        <View style={{ margin: 15 }}>
          <TouchableOpacity
            onPressOut={async (): Promise<void> => {
              await Action.deauth();
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
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

export { MainLayout };
