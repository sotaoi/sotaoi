import React from 'react';
import { TaskForm } from '@sotaoi/client/forms/form-classes/task-form';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MobileTaskUserForm = (props: { form: TaskForm }): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.fields;

  return (
    <View style={{ marginLeft: 20 }}>
      <Form.FormComponent>
        {/*  */}

        {/* param1 */}
        <View style={{ marginTop: 20 }}>
          {fields.param1.wasTouched() &&
            fields.param1.getErrors().map((error: any, index: any) => (
              <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </Text>
            ))}
          <fields.param1.component placeholder={'param1'} />
        </View>

        {/* param2 */}
        <View>
          {fields.param2.wasTouched() &&
            fields.param2.getErrors().map((error: any, index: any) => (
              <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </Text>
            ))}
          <fields.param2.component placeholder={'param2'} />
        </View>

        {/* submit btn */}
        <TouchableOpacity style={{ marginTop: 20 }} onPressOut={(): void => Form.submit()}>
          <Text>Run Task</Text>
        </TouchableOpacity>

        {/*  */}
      </Form.FormComponent>
    </View>
  );
};

export { MobileTaskUserForm };
