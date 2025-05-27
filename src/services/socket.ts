
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionPromise: Promise<Socket> | null = null;

  connect(userId: string): Socket {
    if (this.socket?.connected) {
      console.log('✅ Socket already connected');
      return this.socket;
    }

    // If already connecting, return the existing promise
    if (this.connectionPromise) {
      return this.socket!;
    }

    // Disconnect any existing connection
    if (this.socket) {
      this.socket.disconnect();
    }

    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : `${window.location.protocol.replace(':', '')}//${window.location.hostname}:3001`;

    console.log('🔌 Connecting to server:', serverUrl);

    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server:', this.socket?.id);
        this.reconnectAttempts = 0;
        this.connectionPromise = null;
        
        // Join user room
        this.socket?.emit('join_user', userId);
        resolve(this.socket!);
      });

      this.socket.on('connected', (data) => {
        console.log('✅ User joined room:', data);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached');
          this.connectionPromise = null;
          reject(error);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from server:', reason);
        this.connectionPromise = null;
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected after', attemptNumber, 'attempts');
        this.reconnectAttempts = 0;
      });

      this.socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.connectionPromise = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export default new SocketService();
