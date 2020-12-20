import React from 'react';
import { View, Text } from 'react-native';
import { Helper } from '@sotaoi/client/helper';
import { tailwind } from '@sotaoi/client/components/styles';
// !!
// import { Button } from '@sotaoi/client/components/button';

const HomeRoute = (): null | React.ReactElement => {
  switch (true) {
    case Helper.isWeb():
      return (
        <>
          {/* <span id={'blackOverlay'} className={'w-full h-full absolute opacity-20 bg-white'}></span> */}
          {/* <style>{@import `url('https://fonts.googleapis.com/css2?family=Lusitana&display=swap)`}</style> */}
          <section
            className="font-sans h-screen w-full bg-opacity-50 bg-cover text-center flex flex-col items-center justify-center"
            style={{ backgroundImage: 'url(banner-background.jpg)' }}
          >
            <h3 className="text-gray mx-auto max-w-lg overlay mt-4 font-normal text-5xl leading-norma cover-fulll">
              Read stories
            </h3>
          </section>
        </>
      );
    case Helper.isMobile():
      {
        /* <Button
            onPress={(): void => {
              console.log('yoyo');
            }}
            title={'asd'}
          /> */
      }
      return (
        <View style={tailwind('pt-12 items-center')}>
          <View style={tailwind('bg-blue-200 px-3 py-1 rounded-full')}>
            <Text style={tailwind('text-blue-800 font-semibold')}>Hello, Tailwind!</Text>
          </View>
        </View>
      );
    case Helper.isElectron():
      console.warn('nothing here yet');
      return null;
    default:
      throw new Error('unknown environment');
  }
};

export { HomeRoute };
