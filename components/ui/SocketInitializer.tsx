"use client";

import { useEffect } from 'react';

export default function SocketInitializer() {
  useEffect(() => {
    // Initialize Socket.IO server on client side
    const initializeSocket = async () => {
      try {
        console.log('Initializing Socket.IO server from client...');
        const response = await fetch('/api/socket', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('Socket.IO server initialized:', result);
        } else {
          console.error('Failed to initialize Socket.IO server:', result.error);
        }
      } catch (error) {
        console.error('Error initializing Socket.IO server:', error);
      }
    };

    // Initialize after a short delay to ensure the app is ready
    const timer = setTimeout(initializeSocket, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
} 