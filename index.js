import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { App } from '@app/client/cmobile.entry';
import { name as appName } from '@sotaoi/client/app.json';

AppRegistry.registerComponent(appName, () => App);
