import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string): Socket {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    // Disconnect any existing connection
    if (this.socket) {
      this.socket.disconnect();
    }

    const serverUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : `${window.location.protocol}//${window.location.hostname}:3001`;

    console.log('Connecting to server:', serverUrl);

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.socket?.emit('join_user', userId);
    });

    this.socket.on('connected', (data) => {
      console.log('✅ User joined room:', data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();