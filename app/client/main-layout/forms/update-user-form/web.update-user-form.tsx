import React from 'react';
import { BaseField, SingleCollectionField } from '@sotaoi/client/forms';
import { UpdateForm } from '@sotaoi/client/forms/form-classes/update-form';
import { RecordEntry } from '@sotaoi/omni/artifacts';

interface FieldState {
  [key: string]: BaseField<any>;
  address: SingleCollectionField;
}
const WebUpdateUserForm = (props: { form: UpdateForm; countries: RecordEntry[] }): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.getFields<FieldState>();
  const address = fields.address.getFields();
  const countries = props.countries;

  return (
    <section style={{ margin: 20 }}>
      <Form.FormComponent>
        <button disabled={!Form.getFormState().canSubmit} type={'submit'}>
          Update User
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
          fields.email.getErrors().map((error, index) => (
            <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
              {error}
            </div>
          ))}
        {/* tailwind example */}
        <fields.email.component
          className={
            'px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline'
          }
          placeholder={'email'}
        />
        <br />
        <br />
        {fields.password.wasTouched() &&
          fields.password.getErrors().map((error, index) => (
            <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
              {error}
            </div>
          ))}
        <fields.password.component autoComplete={'off'} type={'password'} placeholder={'password'} />
        <br />
        <br />
        <section>
          {fields.address.getFields().street.wasTouched() &&
            fields.address
              .getFields()
              .street.getErrors()
              .map((error, index) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
          <address.street.component placeholder={'street'} />
          <br />
          <br />
          {fields.address.getFields().country.wasTouched() &&
            fields.address
              .getFields()
              .country.getErrors()
              .map((error, index) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
          <address.country.component>
            {countries.map((country) => (
              <option key={country.uuid} value={JSON.stringify({ repository: 'country', uuid: country.uuid })}>
                {country.name}
              </option>
            ))}
          </address.country.component>
          <br />
        </section>
        <br />
        <br />

        <button disabled={!Form.getFormState().canSubmit} type={'submit'}>
          Update User
        </button>
      </Form.FormComponent>
    </section>
  );
};

export { WebUpdateUserForm };
