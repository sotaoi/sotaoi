import React from 'react';
import { Link } from '@sotaoi/client/router';
import { Helper } from '@sotaoi/client/helper';
import { StoreForm } from '@sotaoi/client/forms/form-classes/store-form';
import { BaseField, SingleCollectionField } from '@sotaoi/client/forms';
// import { RecordEntry } from '@sotaoi/omni/artifacts';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { Picker } from '@react-native-picker/picker';

interface FieldState {
  [key: string]: BaseField<any>;
  address: SingleCollectionField;
}
// const MobileRegisterUserForm = (props: { form: StoreForm; countries: RecordEntry[]; }): null | React.ReactElement => {
const MobileRegisterUserForm = (props: { form: StoreForm }): null | React.ReactElement => {
  const Form = props.form;
  const fields = Form.getFields<FieldState>();
  // const address = fields.address.getFields();
  // const countries = props.countries;

  return (
    <View style={{ marginLeft: 20 }}>
      <Link to={'/gate/register/user/' + Helper.encodeSegment({ code: 'ro' })}>filter test</Link>

      <Form.FormComponent>
        <View style={{ marginTop: 20 }}>
          {fields.email.wasTouched() &&
            fields.email.getErrors().map((error: any, index: any) => (
              <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </Text>
            ))}
          <fields.email.component placeholder={'email'} />
        </View>

        <View>
          {fields.password.wasTouched() &&
            fields.password.getErrors().map((error: any, index: any) => (
              <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                {error}
              </Text>
            ))}
          <fields.password.component secureTextEntry={true} placeholder={'password'} />
        </View>

        {/* <View>
          {fields.address.getFields().street.wasTouched() &&
            fields.address
              .getFields()
              .street.getErrors()
              .map((error: any, index: any) => (
                <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </Text>
              ))}
          <address.street.component placeholder={'street'} />
        </View>

        <View>
          {fields.address.getFields().country.wasTouched() &&
            fields.address
              .getFields()
              .country.getErrors()
              .map((error: any, index: any) => (
                <Text key={index} style={{ color: '#ff3333', marginBottom: 10 }}>
                  {error}
                </Text>
              ))}
          <address.country.component>
            {countries.map((country: RecordEntry) => (
              <Picker.Item
                key={country.uuid}
                label={country.name}
                value={JSON.stringify({ repository: 'country', uuid: country.uuid })}
              />
            ))}
          </address.country.component>
        </View> */}

        <TouchableOpacity style={{ marginTop: 20 }} onPressOut={(): void => Form.submit()}>
          <Text>Create User</Text>
        </TouchableOpacity>
      </Form.FormComponent>
    </View>
  );
};

export { MobileRegisterUserForm };
