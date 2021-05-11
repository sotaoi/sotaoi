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

  const finish = async (): Promise<void> => {
    const conclusion = await installBundleAction();
    conclusion.notify();
    conclusion.result().success && setState({ install: true });
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
      {state.install === true && <div>All done. Please wait app restart</div>}
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

// import React from 'react';
// import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
// import { BaseField } from '@sotaoi/client/forms';
// import { FileField } from '@sotaoi/client/forms/fields/file-field';

// interface FieldState {
//   [key: string]: BaseField<any>;
//   avatar: FileField;
// }
// const WebRegisterUserForm = (props: { form: StoreForm; }): null | React.ReactElement => {
//   const Form = props.form;
//   const fields = Form.getFields<FieldState>();
//   // const address = fields.address.getFields();
//   // const countries = props.countries;

//   return (
//     <section style={{ margin: 20 }}>
//       <div className={'w-full max-w-md m-auto bg-white-100 shadow-md rounded p-5'}>
//         <h1 className={'text-center sm:text-3xl text-2xl font-medium title-font mb-4 text-indigo-900'}>Installation</h1>

//         <Form.FormComponent>
//           <button disabled={!Form.getFormState().canSubmit} type={'submit'} onClick={(): void => Form.submit()}>
//             Install
//           </button>
//           <br />
//           <br />
//           <br />
//           {fields.email.wasTouched() &&
//             fields.email.getErrors().map((error: any, index: any) => (
//               <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
//                 {error}
//               </div>
//             ))}
//           <fields.email.component
//             className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
//             placeholder={'email'}
//           />
//           <br />

//           {fields.password.wasTouched() &&
//             fields.password.getErrors().map((error: any, index: any) => (
//               <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
//                 {error}
//               </div>
//             ))}
//           <fields.password.component
//             autoComplete={'off'}
//             className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
//             placeholder={'password'}
//             type={'password'}
//           />
//           <br />

//           {fields.avatar.wasTouched() &&
//             fields.avatar.getErrors().map((error: any, index: any) => (
//               <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
//                 {error}
//               </div>
//             ))}
//           <fields.avatar.component
//             className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
//           />
//           {fields.avatar.getPreview() && (
//             <div>
//               <img src={fields.avatar.getPreview()} />
//             </div>
//           )}
//           <br />

//           <button
//             className={'w-full bg-green-700 text-white font-bold py-2 px-4 mb-6 rounded'}
//             disabled={!Form.getFormState().canSubmit}
//             type={'submit'}
//             onClick={(): void => Form.submit()}
//           >
//             Install
//           </button>
//         </Form.FormComponent>
//       </div>
//     </section>
//   );
// };

// export { WebRegisterUserForm };
