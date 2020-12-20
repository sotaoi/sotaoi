import React from 'react';
import { AuthForm } from '@sotaoi/client/forms/form-classes/auth-form';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MobileAuthUserForm = (props: { form: AuthForm }): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.getFields();

  return (
    <View style={{ marginLeft: 20 }}>
      <Form.FormComponent>
        {/*  */}

        {/* email */}
        <View style={{ marginTop: 20 }}>
          {fields.email.wasTouched() &&
            fields.email.getErrors().map((error: any, index: any) => (
              <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </Text>
            ))}
          <fields.email.component placeholder={'email'} />
        </View>

        {/* password */}
        <View>
          {fields.password.wasTouched() &&
            fields.password.getErrors().map((error: any, index: any) => (
              <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </Text>
            ))}
          <fields.password.component secureTextEntry={true} placeholder={'password'} />
        </View>

        {/* submit btn */}
        <TouchableOpacity style={{ marginTop: 20 }} onPressOut={(): void => Form.submit()}>
          <Text>Login</Text>
        </TouchableOpacity>

        {/*  */}
      </Form.FormComponent>
    </View>
  );
};

export { MobileAuthUserForm };
