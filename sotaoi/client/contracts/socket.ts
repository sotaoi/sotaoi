interface SocketOptions {
  [key: string]: any;
  transports: string[];
}

interface SocketClass {
  [key: string]: any;
  on(event: string, callback: ((msg: any) => Promise<any>) | ((msg: any) => any)): void;
}

abstract class Socket {
  abstract connect(url: string, options: SocketOptions): SocketClass;
  abstract io(): SocketClass;
}

export { Socket };
export type { SocketOptions, SocketClass };
