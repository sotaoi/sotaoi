import React from 'react';
import { Link } from '@sotaoi/client/router';
import { Helper } from '@sotaoi/client/helper';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
// import { BaseField, SingleCollectionField } from '@sotaoi/client/forms';
import { BaseField } from '@sotaoi/client/forms';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { FileField } from '@sotaoi/client/forms/fields/file-field';

interface FieldState {
  [key: string]: BaseField<any>;
  avatar: FileField;
  // gallery: MultiFileField;
  // address: SingleCollectionField;
}
// const WebRegisterUserForm = (props: { form: StoreForm; countries: RecordEntry[]; }): null | React.ReactElement => {
const WebRegisterUserForm = (props: { form: StoreForm }): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.getFields<FieldState>();
  // const address = fields.address.getFields();
  // const countries = props.countries;

  return (
    <section style={{ margin: 20 }}>
      <Link to={'/gate/register/user/' + Helper.encodeSegment({ code: 'ro' })}>filter test</Link>
      <br />
      <br />
      <div className={'w-full max-w-md m-auto bg-white-100 shadow-md rounded p-5'}>
        <h1 className={'text-center sm:text-3xl text-2xl font-medium title-font mb-4 text-indigo-900'}>Sign Up</h1>

        <Form.FormComponent>
          <button disabled={!Form.getFormState().canSubmit} type={'submit'} onClick={(): void => Form.submit()}>
            Create User
          </button>
          <br />
          <br />
          <button onClick={(): void => Form.reset()} type={'button'}>
            Reset
          </button>
          <br />
          <br />
          <br />
          {fields.email.wasTouched() &&
            fields.email.getErrors().map((error: any, index: any) => (
              <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </div>
            ))}
          <fields.email.component
            className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
            placeholder={'email'}
          />
          <br />

          {fields.password.wasTouched() &&
            fields.password.getErrors().map((error: any, index: any) => (
              <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </div>
            ))}
          <fields.password.component
            autoComplete={'off'}
            className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
            placeholder={'password'}
            type={'password'}
          />
          <br />

          {fields.avatar.wasTouched() &&
            fields.avatar.getErrors().map((error: any, index: any) => (
              <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </div>
            ))}
          <fields.avatar.component
            className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
          />
          {fields.avatar.getPreview() && (
            <div>
              <img src={fields.avatar.getPreview()} />
            </div>
          )}
          <br />

          {/* {fields.gallery.wasTouched() &&
            fields.gallery.getErrors().map((error: any, index: any) => (
              <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </div>
            ))}
          <fields.gallery.component
            className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
          />
          {!fields.gallery.isEmpty() && <button onClick={(): void => fields.gallery.clear()}>Remove</button>}
          {!!fields.gallery.getPreviews().length && (
            <div>
              {fields.gallery.getPreviews().map((preview, index) => (
                <img key={preview + index} src={preview} style={{ maxWidth: 200, maxHeight: 200 }} />
              ))}
            </div>
          )}
          <br />

          <section>
            {address.street.wasTouched() &&
              address.street.getErrors().map((error: any, index: any) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
            <address.street.component
              placeholder={'street'}
              className={'w-full p-2 mb-6 text-black border-b-2 border-green-500 outline-none focus:bg-gray-300'}
            />
            <br />
            <label className={'block mb-2 text-indigo-500'}>Country</label>
            {address.country.wasTouched() &&
              address.country.getErrors().map((error: any, index: any) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
            <address.country.component>
              {countries.map((country: RecordEntry) => (
                <option key={country.uuid} value={JSON.stringify({ repository: 'country', uuid: country.uuid })}>
                  {country.name}
                </option>
              ))}
            </address.country.component>
            <br />
          </section>
          <br />
          <br /> */}

          <button
            className={'w-full bg-green-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded'}
            disabled={!Form.getFormState().canSubmit}
            type={'submit'}
            onClick={(): void => Form.submit()}
          >
            Create User
          </button>
          <button
            className={'w-full bg-red-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded'}
            onClick={(): void => Form.reset()}
            type={'button'}
          >
            Reset
          </button>
        </Form.FormComponent>
      </div>
    </section>
  );
};

export { WebRegisterUserForm };
