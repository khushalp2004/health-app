# Real-Time Notifications with Socket.IO

This document explains how the real-time notification system works in the MediSlot health app.

## Overview

The app now uses Socket.IO to provide real-time notifications for:
- New emergency appointments
- New regular appointments
- Live notification count updates
- Toast notifications with action buttons

## Architecture

### Server-Side (Socket.IO Server)
- **File**: `lib/socket.ts`
- **API Routes**: 
  - `app/api/socket/route.ts` - Socket initialization
  - `app/api/notifications/trigger/route.ts` - Notification triggers
  - `app/api/test-notification/route.ts` - Test notifications

### Client-Side (Socket.IO Client)
- **Provider**: `components/providers/SocketProvider.tsx`
- **Hook**: `lib/hooks/useSocket.ts` (alternative)
- **Component**: `components/ui/RealTimeNotificationBell.tsx`

## Features

### 1. Real-Time Notification Bell
- Shows live count of pending notifications
- Animates when new notifications arrive
- Color-coded (red for emergency, blue for regular)
- Connection status indicator

### 2. Toast Notifications
- Automatic toast popups for new notifications
- Action buttons to navigate to relevant pages
- Different styles for emergency vs regular notifications

### 3. Automatic Triggers
- Notifications are automatically triggered when:
  - New emergency appointments are created
  - New regular appointments are created
  - Appointments are updated

## How It Works

### 1. Connection Setup
```typescript
// SocketProvider automatically connects on app load
const socket = io('http://localhost:3000');
socket.emit('admin-connect', 'admin'); // Join admin room
```

### 2. Notification Emission
```typescript
// Server-side (in appointment actions)
await triggerNotification('emergency', {
  id: newEmergency.$id,
  name: emergencyAppointment.name,
  reason: emergencyAppointment.reason,
  // ... other data
});
```

### 3. Real-Time Reception
```typescript
// Client-side (in RealTimeNotificationBell)
socket.on('new-emergency', (data) => {
  setCount(prev => prev + 1);
  setIsAnimating(true);
  toast.error(`🚨 New Emergency: ${data.name} - ${data.reason}`);
});
```

## Usage

### 1. Admin Dashboard (`/admin`)
- Shows emergency notification bell
- Displays count of pending emergency appointments
- Real-time updates when new emergencies are created

### 2. Emergency Dashboard (`/admin/emergencyDash`)
- Shows regular appointment notification bell
- Displays count of pending regular appointments
- Real-time updates when new appointments are created

### 3. Testing
- Test buttons are available on both admin pages
- Click "🚨 Test Emergency" to simulate emergency notification
- Click "📅 Test Appointment" to simulate appointment notification

## Environment Variables

Add these to your `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For production, use your domain
```

## Production Deployment

1. **Remove test buttons**: Delete `TestNotificationButtons` component from admin pages
2. **Update URLs**: Set `NEXT_PUBLIC_APP_URL` to your production domain
3. **CORS**: Ensure your production server allows WebSocket connections
4. **SSL**: Use HTTPS in production for secure WebSocket connections

## Troubleshooting

### Connection Issues
- Check browser console for connection errors
- Verify Socket.IO server is running
- Ensure CORS settings are correct

### Notifications Not Working
- Check if SocketProvider is properly wrapped around the app
- Verify notification triggers are being called
- Check server logs for Socket.IO errors

### Performance
- Socket.IO automatically handles reconnection
- Notifications are debounced to prevent spam
- Connection status is shown with yellow indicator

## Customization

### Adding New Notification Types
1. Update `lib/socket.ts` to handle new event types
2. Add new notification triggers in appointment actions
3. Update `RealTimeNotificationBell` to listen for new events
4. Add new toast notification styles

### Styling
- Modify `RealTimeNotificationBell` component for different styles
- Update animation classes in the component
- Customize toast notification appearance

## Security Considerations

- Admin room is used to restrict notifications to admin users only
- Server-side validation of notification data
- Rate limiting can be added to prevent spam
- Consider adding authentication to Socket.IO connections in production 