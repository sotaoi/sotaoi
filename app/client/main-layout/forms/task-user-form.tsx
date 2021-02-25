import React from 'react';
import { ViewComponent, ViewPromises, ViewData } from '@sotaoi/client/components';
import { TaskFormFactory, FormConstructor } from '@sotaoi/client/forms';
import { Artifacts } from '@sotaoi/omni/artifacts';
import { TaskForm } from '@sotaoi/client/forms/form-classes/task-form';
import { WebTaskUserForm } from '@app/client/main-layout/forms/task-user-form/web.task-user-form';
import { MobileTaskUserForm } from '@app/client/main-layout/forms/task-user-form/mobile.task-user-form';
import { InputField } from '@sotaoi/client/forms/fields/input-field';
import { getUserHelloTaskValidations } from '@app/client/queries/validation-queries';

interface TaskUserFormProps {}
class TaskUserForm extends ViewComponent<TaskUserFormProps> {
  public promises(): ViewPromises<TaskUserFormProps> {
    return {
      validations: getUserHelloTaskValidations(),
    };
  }

  public init({ results, props }: ViewData<TaskUserFormProps>): { form: TaskForm } {
    const taskUserFormConstructor = FormConstructor(
      {
        param1: InputField.input(''),
        param2: InputField.input(''),
      },
      results.validations,
    );

    const Form = TaskFormFactory(null, new Artifacts(), null, 'user', 'user-hello-task', taskUserFormConstructor);
    Form.init();

    React.useEffect(() => (): void => Form.destroy(), []);

    Form.onTaskSuccess(async (result) => {
      console.log(result.data);
    });

    return { form: Form };
  }

  public web(data: ViewData<TaskUserFormProps>): null | React.ReactElement {
    return <WebTaskUserForm {...this.init(data)} />;
  }

  public mobile(data: ViewData<TaskUserFormProps>): null | React.ReactElement {
    return <MobileTaskUserForm {...this.init(data)} />;
  }

  public electron(data: ViewData<TaskUserFormProps>): null | React.ReactElement {
    // nothing here yet
    return null;
  }
}

export { TaskUserForm };
