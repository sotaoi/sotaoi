import React from 'react';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { BaseField } from '@sotaoi/client/forms';
import { RecordEntry } from '@sotaoi/omni/artifacts';

interface FieldState {
  [key: string]: BaseField<any>;
}
const WebStorePostForm = (props: {
  form: StoreForm;
  categories: RecordEntry[];
  users: RecordEntry[];
}): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.getFields<FieldState>();
  const categories = props.categories;
  const users = props.users;

  return (
    <section>
      {/* <Link to={'/post/store' + Helper.encodeSegment({ category: 'poetry' })}>filter test</Link> */}
      <Form.FormComponent>
        <div className={'w-full max-w-lg mt-6 m-auto bg-gray shadow-lg rounded p-5'}>
          <h1 className={'title-font sm:text-4xl text-center text-3xl font-medium text-gray-900'}>Write a post</h1>

          <div
            className={
              'lg:w-1/6 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10'
            }
          >
            <label className={'leading-7 text-sm text-gray-600'}>Title</label>

            {fields.title.wasTouched() &&
              fields.title.getErrors().map((error, index) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
            <fields.title.component
              className={
                'w-full bg-white rounded border border-gray-300 focus:border-blue-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
              }
              type={'title'}
              placeholder={'title'}
            />
            <label className={'leading-7 text-sm text-gray-600'}>Content</label>

            {fields.content.wasTouched() &&
              fields.content.getErrors().map((error, index) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
            <fields.content.component
              className={
                'w-full bg-white rounded border border-gray-300 focus:border-blue-500 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
              }
              type={'content'}
              placeholder={'content'}
            />
            <br />

            {fields.user.wasTouched() &&
              fields.user.getErrors().map((error, index) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
            <fields.user.component
              className={
                'rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-blue-500 text-base pl-3 pr-10'
              }
            >
              {users.map((user: RecordEntry) => (
                <option key={user.uuid} value={JSON.stringify({ repository: 'user', uuid: user.uuid })}>
                  {user.email}
                </option>
              ))}
            </fields.user.component>
            <br />

            {fields.category.wasTouched() &&
              fields.category.getErrors().map((error, index) => (
                <div key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </div>
              ))}
            <fields.category.component
              className={
                'rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-blue-500 text-base pl-3 pr-10'
              }
            >
              {categories.map((category: RecordEntry) => (
                <option key={category.uuid} value={JSON.stringify({ repository: 'category', uuid: category.uuid })}>
                  {category.name}
                </option>
              ))}
            </fields.category.component>

            <br />
            <button
              className={
                'text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg'
              }
              disabled={!Form.getFormState().canSubmit}
              type={'submit'}
              onClick={(): void => Form.submit()}
            >
              Create Post
            </button>
            <br />

            <button
              className={'text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg'}
              onClick={(): void => Form.reset()}
              type={'button'}
            >
              Reset
            </button>
          </div>
        </div>
      </Form.FormComponent>
    </section>
  );
};

export { WebStorePostForm };
