import React from 'react';
import { Link, LayoutProps } from '@sotaoi/client/router';

const InstallLayout = (props: LayoutProps): React.ReactElement => {
  return (
    <div>
      <nav className={'flex pl-4 flex-row w-full items-center text-white bg-black shadow'}>
        <Link to={'/'}>
          <button className={'m-2 p-2 text-white rounded text-2xl'}>Install</button>
        </Link>
        <Link to={'/link-1'}>
          <button className={'m-2 p-2 text-white rounded bg-blue-700'}>Nav Example 1</button>
        </Link>
        <Link to={'/link-2'}>
          <button className={'m-2 p-2 text-white rounded'}>Nav Example 2</button>
        </Link>
      </nav>
      <div>{props.children}</div>
    </div>
  );
};

export { InstallLayout };
