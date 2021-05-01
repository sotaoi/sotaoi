import React from 'react';
import { LayoutProps } from '@sotaoi/omni/state';

abstract class ControlPanel {
  abstract getControlPanelLayout(props: LayoutProps): React.ReactElement;
  abstract getControlPanelAuthComponent(props: { [key: string]: any }): null | React.ReactElement;
}

export { ControlPanel };
