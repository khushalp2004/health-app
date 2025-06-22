import { NextRequest, NextResponse } from 'next/server';
import { initSocket, getSocketIO } from '@/lib/socket';

export async function GET(req: NextRequest) {
  try {
    console.log('Socket API route called - initializing socket...');
    
    // Initialize socket if not already done
    const io = initSocket();
    
    if (io) {
      console.log('Socket.IO server initialized successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Socket.IO server initialized',
        connectedClients: io.engine.clientsCount,
        port: 3001
      });
    } else {
      console.error('Failed to initialize Socket.IO server');
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to initialize socket server' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize socket' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();
    const io = getSocketIO();

    if (!io) {
      console.error('Socket.IO server not initialized');
      return NextResponse.json({ 
        success: false, 
        error: 'Socket.IO not initialized' 
      }, { status: 500 });
    }

    // Validate notification type
    if (!['emergency', 'appointment'].includes(type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid notification type' 
      }, { status: 400 });
    }

    // Emit the notification to all connected admin clients
    if (type === 'emergency') {
      io.to('admin-room').emit('new-emergency', data);
      console.log('Emergency notification emitted:', data);
    } else if (type === 'appointment') {
      io.to('admin-room').emit('new-appointment', data);
      console.log('Appointment notification emitted:', data);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${type} notification sent successfully`,
      data,
      connectedClients: io.engine.clientsCount
    });

  } catch (error) {
    console.error('Error triggering notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to trigger notification' 
    }, { status: 500 });
  }
}