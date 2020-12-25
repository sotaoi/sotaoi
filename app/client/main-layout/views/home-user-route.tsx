import React from 'react';
import { View, Text } from 'react-native';
import { Helper } from '@sotaoi/client/helper';
import { tailwind } from '@sotaoi/client/components/styles';
// !!
// import { Button } from '@sotaoi/client/components/button';

const HomeUserRoute = (): null | React.ReactElement => {
  switch (true) {
    case Helper.isWeb():
      return (
        <>
          <main className={'profile-page'}>
            <section className={'relative block'} style={{ height: '500px' }}>
              <div
                className={'absolute top-0 w-full h-full max-h-50 bg-center bg-cover'}
                style={{
                  backgroundImage: `url('background.jpg')`,
                }}
              >
                <span id={'blackOverlay'} className={'w-full h-full absolute opacity-20 bg-black'}></span>
              </div>
              <div
                className={'top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden'}
                style={{ height: '70px', transform: 'translateZ(0)' }}
              >
                <svg
                  className={'absolute bottom-0 overflow-hidden'}
                  xmlns={'http://www.w3.org/2000/svg'}
                  preserveAspectRatio={'none'}
                  version={'1.1'}
                  viewBox={'0 0 2560 100'}
                  x={'0'}
                  y={'0'}
                >
                  <polygon className={'text-gray-300 fill-current'} points={'2560 0 2560 100 0 100'}></polygon>
                </svg>
              </div>
            </section>
            <section className={'relative py-16 bg-gray-300'}>
              <div className={'container mx-auto px-4'}>
                <div
                  className={
                    'relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64'
                  }
                >
                  <div className={'px-4'}>
                    <div className={'flex flex-wrap justify-center'}>
                      <div className={'w-full lg:w-12/12 px-4 lg:order-7 flex justify-center'}>
                        <div className={'relative'}>
                          <img
                            alt="..."
                            src={'profile.jpg'}
                            className={
                              'shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16'
                            }
                            style={{ maxWidth: 200, maxHeight: 200 }}
                          />
                        </div>
                      </div>
                      <div className={'w-full lg:w-10/12 px-4 lg:order-3 lg:text-right lg:self-center'}></div>
                    </div>
                    <div className={'text-center mt-12'}>
                      <br />

                      <br />
                      <h3 className={'text-4xl font-semibold leading-normal mb-6 text-gray-800'}>Name Lastname</h3>
                      <div className={'text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase'}>
                        <i className={'fas fa-map-marker-alt mr-2 text-lg text-gray-500'}></i>Current city
                      </div>
                      <div className={'mb-2 text-gray-700 mt-10'}>
                        <i className={'fas fa-briefcase mr-2 text-lg text-gray-500'}></i>
                        Titles
                      </div>
                      <div className={'mb-2 text-gray-700'}>
                        <i className={'fas fa-university mr-2 text-lg text-gray-500'}></i>
                        Working at
                      </div>
                    </div>
                    <div className={'mt-10 py-10 border-t border-gray-300 text-center'}>
                      <div className={'flex flex-wrap justify-center'}>
                        <div className={'w-full lg:w-9/12 px-4'}>
                          <p className={'mb-4 text-lg leading-relaxed text-gray-800'}>Bio Section</p>
                          <a className={'font-normal text-pink-500'} onClick={(e): any => e.preventDefault()}>
                            Show more
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>
      );
    case Helper.isMobile():
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

export { HomeUserRoute };
