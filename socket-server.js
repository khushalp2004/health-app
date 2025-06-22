const { Server } = require('socket.io');

// Create Socket.IO server
const io = new Server(3001, {
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

// Store connected clients
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle admin connection
  socket.on('admin-connect', (adminId) => {
    connectedClients.set(socket.id, adminId);
    socket.join('admin-room');
    console.log('Admin connected:', adminId);
    
    // Send confirmation
    socket.emit('admin-connected', { success: true, adminId });
  });

  // Handle emergency notification
  socket.on('emergency-notification', (data) => {
    io.to('admin-room').emit('new-emergency', data);
    console.log('Emergency notification sent:', data);
  });

  // Handle regular appointment notification
  socket.on('appointment-notification', (data) => {
    io.to('admin-room').emit('new-appointment', data);
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

console.log('Socket.IO server running on port 3001'); 
 