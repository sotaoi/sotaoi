import React from 'react';
import { Link, LayoutProps } from '@sotaoi/client/router';

const InstallLayout = (props: LayoutProps): React.ReactElement => {
  return (
    <section>
      <nav
        className={
          'font-sans text-white flex flex-col sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-black shadow sm:items-baseline w-full'
        }
      >
        <div className={'mb-2 sm:mb-0'}>
          <span className={'mx-2 text-2xl no-underline text-grey-darkest hover:text-blue-dark'}>
            <Link to={'/'}>Install</Link>
          </span>
          <span
            className={
              'mx-2 py-2 px-4 bg-blue-700 hover:bg-pink-700 text-white font-bold mb-6 rounded no-underline text-grey-darkest hover:text-blue-dark'
            }
          >
            <Link to={'/link-1'}>Nav Example 1</Link>
          </span>
          <span className={'mx-2 text-lg no-underline text-grey-darkest hover:text-blue-dark'}>
            <Link to={'/link-2'}>Nav Example 2</Link>
          </span>
        </div>
      </nav>
      <div>{props.children}</div>
    </section>
  );
};

export { InstallLayout };
