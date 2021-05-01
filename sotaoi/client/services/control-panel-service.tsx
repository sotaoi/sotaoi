import React from 'react';
import { LayoutProps } from '@sotaoi/omni/state';
import { ControlPanel } from '@sotaoi/client/contracts/control-panel';

class ControlPanelService extends ControlPanel {
  public getControlPanelLayout(props: LayoutProps): React.ReactElement {
    return (
      <div>
        <h2>layout</h2>
        {props.children}
      </div>
    );
  }

  public getControlPanelAuthComponent(props: { [key: string]: any }): null | React.ReactElement {
    return <div>ok control panel auth</div>;
  }
}

export { ControlPanelService };
