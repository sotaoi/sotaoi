import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { getUser } from '@app/client/queries/user-queries';
import { Link } from '@sotaoi/client/router';
import { store } from '@sotaoi/client/store';

interface UserViewProps {
  uuid?: string;
}
class UserAboutView extends ViewComponent<UserViewProps> {
  public promises(): ViewPromises<UserViewProps> {
    return {
      user: getUser(),
    };
  }

  public web({ results, props }: ViewData<UserViewProps>): null | React.ReactElement {
    const user = results.user.result.record;
    // console.log(store());
    const avatar = this.asset(user.avatar);
    return (
      <>
        <main className={'profile-page'}>
          <section className={'relative block'} style={{ height: '500px' }}>
            <div
              className={'absolute top-0 w-full h-full max-h-50 bg-center bg-cover'}
              style={{
                backgroundImage: 'background.jpg',
              }}
            >
              <span id={'blackOverlay'} className={'w-full h-full absolute opacity-20 bg-black'}></span>
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
                          src={`${avatar}`}
                          className={
                            'shadow-xl rounded-full h-auto w-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16'
                          }
                          style={{ maxWidth: '150px' }}
                        />
                      </div>
                    </div>
                    <div className={'w-full lg:w-10/12 px-4 lg:order-3 lg:text-right lg:self-center'}></div>
                  </div>
                  <div className={'text-center mt-12'}>
                    <br />
                    <Link to={`/user/edit/${store().getAuthRecord()?.uuid}`}>
                      <button type={'button'} style={{ marginBottom: 20, marginTop: 20 }}>
                        update
                      </button>
                    </Link>
                    <br />
                    <h3 className={'text-4xl font-semibold leading-normal mb-6 text-gray-800'}>{user.email}</h3>
                    <div className={'text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase'}>
                      <i className={'fas fa-map-marker-alt mr-2 text-lg text-gray-500'}></i>Current city
                    </div>
                    <div className={'mb-2 text-gray-700 mt-10'}>
                      <i className={'fas fa-briefcase mr-2 text-lg text-gray-500'}></i>
                      user
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
  }
  public mobile(): null {
    return null;
  }

  public electron(): null {
    return null;
  }
}

export { UserAboutView };
