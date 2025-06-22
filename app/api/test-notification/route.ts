import { NextRequest, NextResponse } from 'next/server';
import { getSocketIO } from '@/lib/socket';

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();
    const io = getSocketIO();

    if (!io) {
      console.error('Socket.IO server not initialized');
      return NextResponse.json({ 
        success: false, 
        error: 'Socket.IO not initialized' 
      }, { status: 500 });
    }

    const testData = {
      id: 'test-' + Date.now(),
      name: 'Test Patient',
      phone: '+1234567890',
      reason: 'Test emergency/appointment',
      primaryPhysician: 'Dr. Test',
      createdAt: new Date().toISOString(),
    };

    if (type === 'emergency') {
      io.to('admin-room').emit('new-emergency', testData);
      console.log('Test emergency notification sent');
    } else if (type === 'appointment') {
      io.to('admin-room').emit('new-appointment', {
        ...testData,
        patient: { name: 'Test Patient' },
        schedule: new Date().toISOString(),
        status: 'pending',
      });
      console.log('Test appointment notification sent');
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Test ${type} notification sent`,
      data: testData,
      connectedClients: io.engine.clientsCount
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send test notification' 
    }, { status: 500 });
  }
} 