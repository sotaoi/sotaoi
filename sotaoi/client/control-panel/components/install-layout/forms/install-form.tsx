import React from 'react';
import { installBundle as installBundleAction } from '@sotaoi/client/control-panel/control-panel-commands';

const InstallForm = () => {
  const [state, setState] = React.useState<{ install: null | true | 'master' | 'bundle' }>({ install: null });

  const installMaster = (): void => {
    setState({ install: 'master' });
  };

  const installBundle = (): void => {
    setState({ install: 'bundle' });
  };

  const goBack = (): void => {
    setState({ install: null });
  };

  const finish = (): void => {
    installBundleAction();
    setState({ install: true });
    window.localStorage.setItem('app.env.freshInstalled', 'yes');
    window.location.reload();
  };

  return (
    <section className={'p-4'}>
      <h4>Hello</h4>
      <hr />
      <p className={'mb-4'}>Welcome</p>
      {state.install === null && (
        <div>
          <button onClick={installMaster} className={'bg-blue-500 rounded py-1 px-2 text-white'}>
            Install master
          </button>
          <span style={{ margin: 10 }}></span>
          <button onClick={installBundle} className={'bg-blue-500 rounded py-1 px-2 text-white'}>
            Install bundle
          </button>
        </div>
      )}
      {state.install === true && <div>All done</div>}
      {state.install === 'master' && (
        <div>
          <button onClick={goBack} className={'mb-4 bg-blue-500 rounded py-1 px-2 text-white'}>
            Back
          </button>
          <div className={'mb-4'}>Installing master</div>
          <div>
            <button onClick={finish} className={'mb-4 bg-blue-500 rounded py-1 px-2 text-white'}>
              Finish
            </button>
          </div>
        </div>
      )}
      {state.install === 'bundle' && (
        <div>
          <button onClick={goBack} className={'mb-4 bg-blue-500 rounded py-1 px-2 text-white'}>
            Back
          </button>
          <div>Installing bundle</div>
        </div>
      )}
    </section>
  );
};

export { InstallForm };
