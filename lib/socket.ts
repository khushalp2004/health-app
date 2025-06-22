import { Server as SocketIOServer } from 'socket.io';

// Global variable to store the Socket.IO server instance
let io: SocketIOServer | null = null;

// Store connected clients
const connectedClients = new Map<string, string>();

export const initSocket = () => {
  if (!io) {
    console.log('Initializing Socket.IO server...');
    
    // Create a new Socket.IO server instance
    io = new SocketIOServer(3001, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      allowUpgrades: true,
      maxHttpBufferSize: 1e6,
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle admin connection
      socket.on('admin-connect', (adminId: string) => {
        connectedClients.set(socket.id, adminId);
        socket.join('admin-room');
        console.log('Admin connected:', adminId);
        
        // Send confirmation
        socket.emit('admin-connected', { success: true, adminId });
      });

      // Handle emergency notification
      socket.on('emergency-notification', (data) => {
        io?.to('admin-room').emit('new-emergency', data);
        console.log('Emergency notification sent:', data);
      });

      // Handle regular appointment notification
      socket.on('appointment-notification', (data) => {
        io?.to('admin-room').emit('new-appointment', data);
        console.log('Appointment notification sent:', data);
      });

      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong');
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        connectedClients.delete(socket.id);
        console.log('Client disconnected:', socket.id, 'Reason:', reason);
      });

      // Handle connection errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    console.log('Socket.IO server initialized successfully on port 3001');
  }
  return io;
};

// Helper function to get the Socket.IO server instance
export const getSocketIO = () => {
  return io;
};

// Helper function to emit notifications from server-side
export const emitNotification = (type: 'emergency' | 'appointment', data: any) => {
  if (io) {
    if (type === 'emergency') {
      io.to('admin-room').emit('new-emergency', data);
    } else if (type === 'appointment') {
      io.to('admin-room').emit('new-appointment', data);
    }
  }
  return { type, data };
}; 