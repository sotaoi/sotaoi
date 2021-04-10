import React from 'react';
import { Navigation } from '@sotaoi/client/router/navigation';
import { State } from '@sotaoi/omni/state';
import { Helper } from '@sotaoi/client/helper';
import { store } from '@sotaoi/client/store';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RequestAbortHandlerAbstract } from '@sotaoi/omni/transactions';
import { View, Text } from 'react-native';

interface NoProps {}

interface RouteData<ComponentProps = NoProps> {
  params: ComponentProps;
  appState: State;
}
abstract class RouteComponent<ComponentProps> extends React.Component<ComponentProps> {
  abstract web(props: RouteData<ComponentProps>): null | React.ReactElement;
  abstract mobile(props: RouteData<ComponentProps>): null | React.ReactElement;
  abstract electron(props: RouteData<ComponentProps>): null | React.ReactElement;

  protected component: (props: RouteData<ComponentProps>) => null | React.ReactElement;

  constructor(props: ComponentProps) {
    super(props);
    this.state = {};
    switch (true) {
      case Helper.isWeb():
        this.component = (data: RouteData<ComponentProps>): null | React.ReactElement => {
          try {
            return this.web(data);
          } catch (err) {
            const Component = this.errorComponent;
            return <Component error={err} />;
          }
        };
        break;
      case Helper.isMobile():
        this.component = (data: RouteData<ComponentProps>): null | React.ReactElement => {
          try {
            return this.mobile(data);
          } catch (err) {
            const Component = this.errorComponent;
            return <Component error={err} />;
          }
        };
        break;
      case Helper.isElectron():
        this.component = (data: RouteData<ComponentProps>): null | React.ReactElement => {
          try {
            return this.electron(data);
          } catch (err) {
            const Component = this.errorComponent;
            return <Component error={err} />;
          }
        };
        break;
      default:
        throw new Error('unknown environment');
    }
  }

  public errorComponent(props: { error: Error }): null | React.ReactElement {
    console.error(props.error);
    return <GenericErrorComponent />;
  }

  public asset(item: null | string, role = 'assets'): null | string {
    return Helper.asset(item, role);
  }
  public assets(items: null | string, role = 'assets'): null | string[] {
    return (items && JSON.parse(items).map((item: string) => Helper.asset(item, role))) || null;
  }

  // todo here: mapStateToProps

  public readonly render = (): null | React.ReactElement => {
    const appState = store().getState();
    const params = Navigation.getParams<ComponentProps>();
    const Component = this.component;
    return <Component appState={appState} params={params} />;
  };
}

interface ViewData<
  ComponentProps,
  MappedState extends { [key: string]: any } = { [key: string]: any },
  DispatchProps extends Action = { type: string; value: any }
> {
  results: { [key: string]: any };
  props: ComponentProps;
  state: MappedState;
  dispatch: Dispatch<DispatchProps>;
}
interface ViewState {
  results: { [key: string]: any };
  success: boolean;
  done: boolean;
}
interface ViewPromises<ComponentProps> {
  [key: string]: (props: ComponentProps, requestAbortHandler: RequestAbortHandler) => Promise<any>;
}
abstract class ViewComponent<
  ComponentProps extends { [key: string]: any },
  State extends { [key: string]: any } = { [key: string]: any },
  MappedState extends { [key: string]: any } = { [key: string]: any },
  DispatchProps extends Action = { type: string; value: any }
> extends React.Component<ComponentProps> {
  abstract promises(): ViewPromises<ComponentProps>;
  abstract web(data: ViewData<ComponentProps, MappedState, DispatchProps>): null | React.ReactElement;
  abstract mobile(data: ViewData<ComponentProps, MappedState, DispatchProps>): null | React.ReactElement;
  abstract electron(data: ViewData<ComponentProps, MappedState, DispatchProps>): null | React.ReactElement;

  public state: ViewState;
  protected unmounted: boolean;
  protected requestAbortHandler: RequestAbortHandler;

  protected component: (data: ViewData<ComponentProps, MappedState, DispatchProps>) => null | React.ReactElement;
  protected dispatch: Dispatch<DispatchProps>;

  constructor(props: ComponentProps) {
    super(props);
    this.state = {
      results: {},
      success: true,
      done: false,
    };
    this.unmounted = false;
    this.requestAbortHandler = new RequestAbortHandler();

    switch (true) {
      case Helper.isWeb():
        this.component = (data: ViewData<ComponentProps, MappedState, DispatchProps>): null | React.ReactElement => {
          try {
            return this.web(data);
          } catch (err) {
            const Component = this.errorComponent;
            return <Component error={err} />;
          }
        };
        break;
      case Helper.isMobile():
        this.component = (data: ViewData<ComponentProps, MappedState, DispatchProps>): null | React.ReactElement => {
          try {
            return this.mobile(data);
          } catch (err) {
            const Component = this.errorComponent;
            return <Component error={err} />;
          }
        };
        break;
      case Helper.isElectron():
        this.component = (data: ViewData<ComponentProps, MappedState, DispatchProps>): null | React.ReactElement => {
          try {
            return this.electron(data);
          } catch (err) {
            const Component = this.errorComponent;
            return <Component error={err} />;
          }
        };
        break;
      default:
        throw new Error('unknown environment');
    }
    this.dispatch = <T extends DispatchProps>(action: T): T => Navigation.reduxStore?.dispatch(action) || action;
  }

  public errorComponent(props: { error: Error }): null | React.ReactElement {
    console.error(props.error);
    return <GenericErrorComponent />;
  }

  public asset(item: null | string, role = 'assets'): null | string {
    return Helper.asset(item, role);
  }
  public assets(items: null | string, role = 'assets'): null | string[] {
    return (items && JSON.parse(items).map((item: string) => Helper.asset(item, role))) || null;
  }

  public mapStateToProps(
    state: State,
    props: Omit<ViewData<ComponentProps, MappedState, DispatchProps>, 'dispatch'>,
  ): MappedState {
    return state as any;
  }

  public readonly componentDidMount = (): void => {
    this.unmounted = false;
    this.state.success = true;
    if (this.state.done) {
      return;
    }
    this.parsePromises(this.promises(), this.props, this.state).then(
      (state) => !this.unmounted && this.setState(state),
    );
  };

  public readonly componentWillUnmount = (): void => {
    this.unmounted = true;
    this.requestAbortHandler.abort();
  };

  public readonly componentDidUpdate = (
    prevProps: Readonly<ComponentProps>,
    prevState: Readonly<ViewState>,
    snapshot: any,
  ): void => {
    if (Object.keys(prevProps).length !== Object.keys(this.props).length) {
      this.parsePromises(this.promises(), this.props, this.state).then(
        (state) => !this.unmounted && this.setState(state),
      );
      return;
    }
    for (const index of Object.keys(prevProps)) {
      if (prevProps[index] !== this.props[index]) {
        this.parsePromises(this.promises(), this.props, this.state).then(
          (state) => !this.unmounted && this.setState(state),
        );
        return;
      }
    }
  };

  public readonly render = (): null | React.ReactElement => {
    if (!this.state.done) {
      return null;
    }
    if (!this.state.success) {
      console.error('one or more promises failed:', this.state.results);
      return null;
    }

    const Component = this.component;
    if (Navigation.reduxStore) {
      const Connect = connect<
        { state: MappedState },
        undefined,
        Omit<ViewData<ComponentProps, MappedState, DispatchProps>, 'dispatch'>,
        State
      >((state: State, props: Omit<ViewData<ComponentProps, MappedState, DispatchProps>, 'dispatch'>) => ({
        state: this.mapStateToProps(state, props),
      }))((props: Omit<ViewData<ComponentProps, MappedState, DispatchProps>, 'dispatch'>) => {
        return (
          <Component
            dispatch={this.dispatch.bind(this)}
            results={this.state.results}
            props={this.props}
            state={props.state}
          />
        );
      });
      return <Connect results={this.state.results} props={this.props} state={{} as MappedState} />;
    }
    return (
      <Component
        dispatch={this.dispatch.bind(this)}
        results={this.state.results}
        props={this.props}
        state={{} as MappedState}
      />
    );
  };

  protected parsePromises(promises: ViewPromises<any>, props: ComponentProps, state: ViewState): Promise<any> {
    this.requestAbortHandler.abort();
    return new Promise((resolve) => {
      Promise.all(Object.values(promises).map((promise) => promise(props, this.requestAbortHandler)))
        .then((res) => {
          Object.keys(promises).map((key, index) => {
            typeof res[index].success !== 'undefined' && !res[index].success && (state.success = false);
            state.results[key] = res[index];
          });
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.requestAbortHandler.clear();
          resolve({ results: state.results, success: state.success, done: true });
        });
    });
  }
}

class RequestAbortHandler extends RequestAbortHandlerAbstract {
  constructor() {
    super();
    this.aborts = [];
  }

  public abort(): void {
    this.aborts.map((abort) => abort());
  }

  public register(abort: () => void): void {
    this.aborts.push(abort);
  }

  public clear(): void {
    this.aborts = [];
  }
}

const GenericTextComponent = (props: { text: string }): React.ReactElement => {
  if (Helper.isWeb()) {
    return (
      <div>
        <span>{props.text}</span>
      </div>
    );
  }
  if (Helper.isMobile()) {
    return (
      <View>
        <Text>{props.text}</Text>
      </View>
    );
  }
  if (Helper.isElectron()) {
    throw new Error('Electron not yet implemented');
  }
  throw new Error('Unknown environment');
};

const GenericErrorComponent = (props: NoProps) => {
  if (Helper.isWeb()) {
    return <img src={'/sotaoi/errors/error.svg'} style={{ margin: 10, width: 100, height: 100 }} />;
  }
  if (Helper.isMobile()) {
    throw new Error('todo here: mobile');
  }
  if (Helper.isElectron()) {
    throw new Error('Electron not yet implemented');
  }
  throw new Error('Unknown environment');
};

export { RouteComponent, ViewComponent, RequestAbortHandler };
export type { RouteData, ViewData, ViewPromises };
