import React from 'react';
import { Platform, StyleSheet, ColorValue, TouchableNativeFeedback, TouchableOpacity, View, Text } from 'react-native';
import invariant from 'invariant';

// !!

type ButtonProps = Readonly<{
  /**
    Text to display inside the button. On Android the given title will be
    converted to the uppercased form.
  */
  title: string;

  /**
    Handler to be called when the user taps the button. The first function
    argument is an event in form of [PressEvent](pressevent).
  */
  onPress: (event?: any) => any;

  /**
    If `true`, doesn't play system sound on touch.
    @platform android
    @default false
    */
  touchSoundDisabled?: boolean;

  /**
        Color of the text (iOS), or background color of the button (Android).
        @default {@platform android} '#2196F3'
        @default {@platform ios} '#007AFF'
       */
  color?: ColorValue;

  /**
        TV preferred focus.
        @platform tv
        @default false
       */
  hasTVPreferredFocus?: boolean;

  /**
        Designates the next view to receive focus when the user navigates down. See
        the [Android documentation][android:nextFocusDown].
        [android:nextFocusDown]:
        https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown
        @platform android, tv
       */
  nextFocusDown?: number;

  /**
        Designates the next view to receive focus when the user navigates forward.
        See the [Android documentation][android:nextFocusForward].
        [android:nextFocusForward]:
        https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward
        @platform android, tv
       */
  nextFocusForward?: number;

  /**
        Designates the next view to receive focus when the user navigates left. See
        the [Android documentation][android:nextFocusLeft].
        [android:nextFocusLeft]:
        https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft
        @platform android, tv
       */
  nextFocusLeft?: number;

  /**
        Designates the next view to receive focus when the user navigates right. See
        the [Android documentation][android:nextFocusRight].
        [android:nextFocusRight]:
        https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight
        @platform android, tv
       */
  nextFocusRight?: number;

  /**
        Designates the next view to receive focus when the user navigates up. See
        the [Android documentation][android:nextFocusUp].
        [android:nextFocusUp]:
        https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp
        @platform android, tv
       */
  nextFocusUp?: number;

  /**
        Text to display for blindness accessibility features.
       */
  accessibilityLabel?: string;

  /**
        If `true`, disable all interactions for this component.
        @default false
       */
  disabled?: boolean;

  /**
        Used to locate this view in end-to-end tests.
       */
  testID?: string;
}>;

class Button extends React.Component<ButtonProps> {
  render(): React.ReactNode {
    const {
      accessibilityLabel,
      color,
      onPress,
      touchSoundDisabled,
      title,
      hasTVPreferredFocus,
      nextFocusDown,
      nextFocusForward,
      nextFocusLeft,
      nextFocusRight,
      nextFocusUp,
      disabled,
      testID,
    } = this.props;
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];
    if (color) {
      if (Platform.OS === 'ios') {
        textStyles.push({ color: color });
      } else {
        buttonStyles.push({ backgroundColor: color });
      }
    }
    const accessibilityState: { [key: string]: any } = {};
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
      accessibilityState.disabled = true;
    }
    invariant(typeof title === 'string', 'The title prop of a Button must be a string');
    const formattedTitle = Platform.OS === 'android' ? title.toUpperCase() : title;
    const Touchable: any = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={'button'}
        accessibilityState={accessibilityState}
        hasTVPreferredFocus={hasTVPreferredFocus}
        nextFocusDown={nextFocusDown}
        nextFocusForward={nextFocusForward}
        nextFocusLeft={nextFocusLeft}
        nextFocusRight={nextFocusRight}
        nextFocusUp={nextFocusUp}
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        touchSoundDisabled={touchSoundDisabled}
      >
        <View style={buttonStyles}>
          <Text style={textStyles} {...{ disabled: !!disabled }}>
            {formattedTitle}
          </Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  button: Platform.select<any>({
    ios: {},
    android: {
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  text: {
    textAlign: 'center',
    margin: 8,
    ...Platform.select<any>({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '500',
      },
    }),
  },
  buttonDisabled: Platform.select<any>({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
  textDisabled: Platform.select<any>({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  }),
});

export { Button };
export type { ButtonProps };
