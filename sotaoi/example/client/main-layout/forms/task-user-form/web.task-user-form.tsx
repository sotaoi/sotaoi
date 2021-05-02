import React from 'react';
import { TaskForm } from '@sotaoi/client/forms/form-classes/task-form';

const WebTaskUserForm = (props: { form: TaskForm }): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.fields;

  return (
    <section style={{ margin: 20 }}>
      <Form.FormComponent>
        {fields.param1.wasTouched() &&
          fields.param1.getErrors().map((error, index) => (
            <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
              {error}
            </div>
          ))}
        <fields.param1.component placeholder={'param1'} />
        <br />
        <br />
        {fields.param2.wasTouched() &&
          fields.param2.getErrors().map((error, index) => (
            <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
              {error}
            </div>
          ))}
        <fields.param2.component placeholder={'param2'} />
        <br />
        <br />

        <button disabled={!Form.getFormState().canSubmit} type={'submit'} onClick={(): void => Form.submit()}>
          Run Task
        </button>
      </Form.FormComponent>
    </section>
  );
};

export { WebTaskUserForm };
