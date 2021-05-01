import React from 'react';
import { Helper } from '@sotaoi/client/helper';
import { RouteChange } from '@sotaoi/client/router/route-change';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface LinkProps {
  children: any;
  to: string | ((ev: any) => Promise<void>);
  noGoTop?: boolean;
}
const Link: React.FunctionComponent<LinkProps> = (props: LinkProps) => {
  if (Helper.isWeb()) {
    if (typeof props.to === 'function') {
      return (
        <a
          onClick={(ev): boolean => {
            ev.preventDefault();
            typeof props.to === 'function' && props.to(ev);
            return false;
          }}
        >
          {props.children}
        </a>
      );
    }
    return (
      <a
        href={props.to}
        onClick={(ev): boolean => {
          ev.preventDefault();
          RouteChange.pushRoute(typeof props.to === 'string' ? props.to : '/', !props.noGoTop);
          return false;
        }}
      >
        {props.children}
      </a>
    );
  }

  if (Helper.isMobile()) {
    const item = typeof props.children === 'string' ? <Text>{props.children}</Text> : props.children;
    return (
      <TouchableOpacity
        hitSlop={{
          bottom: 10,
          left: 10,
          right: 10,
          top: 10,
        }}
        onPressOut={(ev): void => {
          if (typeof props.to === 'function') {
            props.to(ev);
            return;
          }
          RouteChange.pushRoute(props.to);
        }}
        style={{ opacity: 0.9 }}
      >
        {item}
      </TouchableOpacity>
    );
  }

  if (Helper.isElectron()) {
    // nothing here yet
    return null;
  }

  throw new Error('unknown environment');
};

export { Link };
