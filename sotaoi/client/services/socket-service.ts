import { Socket, SocketClass, SocketOptions } from '@sotaoi/client/contracts/socket';
const { io } = require('socket.io/client-dist/socket.io.js');

class SocketService extends Socket {
  protected _io: null | SocketClass = null;

  public connect(url: string, options: SocketOptions): SocketClass {
    this._io = io.connect(url, options);
    if (!this._io) {
      throw new Error('Socket connection failed');
    }
    return this._io;
  }

  public io(): SocketClass {
    if (!this._io) {
      throw new Error('Socket is not yet connected');
    }
    return this._io;
  }
}

export { SocketService };
