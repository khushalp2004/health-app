"use client";

import { useState } from 'react';
import { Button } from './button';

export default function TestNotificationButtons() {
  const [isLoading, setIsLoading] = useState(false);

  const triggerTestNotification = async (type: 'emergency' | 'appointment') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`${type} notification triggered successfully`);
      } else {
        console.error('Failed to trigger notification:', result.error);
      }
    } catch (error) {
      console.error('Error triggering notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <Button
        onClick={() => triggerTestNotification('emergency')}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        {isLoading ? 'Sending...' : '🚨 Test Emergency'}
      </Button>
      
      <Button
        onClick={() => triggerTestNotification('appointment')}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        {isLoading ? 'Sending...' : '📅 Test Appointment'}
      </Button>
    </div>
  );
} 