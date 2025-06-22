"use client";

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useSocketContext } from '@/components/providers/SocketProvider';
import { toast } from 'sonner';

interface RealTimeNotificationBellProps {
  type: 'emergency' | 'regular';
  initialCount: number;
  href: string;
  className?: string;
}

export default function RealTimeNotificationBell({ 
  type, 
  initialCount, 
  href, 
  className = "" 
}: RealTimeNotificationBellProps) {
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available yet...');
      return;
    }

    console.log(`Setting up ${type} notification listeners...`);

    // Listen for new emergency notifications
    if (type === 'emergency') {
      const handleEmergency = (data: any) => {
        console.log('Emergency notification received:', data);
        setCount(prev => prev + 1);
        setIsAnimating(true);
        
        // Show toast notification
        toast.error(`New Emergency: ${data.name} - ${data.reason}`, {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => window.location.href = href,
          },
        });

        // Stop animation after 3 seconds
        setTimeout(() => setIsAnimating(false), 3000);
      };

      socket.on('new-emergency', handleEmergency);
      
      return () => {
        socket.off('new-emergency', handleEmergency);
      };
    }

    // Listen for new regular appointment notifications
    if (type === 'regular') {
      const handleAppointment = (data: any) => {
        console.log('Appointment notification received:', data);
        setCount(prev => prev + 1);
        setIsAnimating(true);
        
        // Show toast notification
        toast.success(`📅 New Appointment: ${data.patient?.name || 'Patient'}`, {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => window.location.href = href,
          },
        });

        // Stop animation after 3 seconds
        setTimeout(() => setIsAnimating(false), 3000);
      };

      socket.on('new-appointment', handleAppointment);
      
      return () => {
        socket.off('new-appointment', handleAppointment);
      };
    }
  }, [socket, type, href]);

  // Reset count when navigating to the page
  const handleClick = () => {
    setCount(0);
    setIsAnimating(false);
  };

  const getBellColor = () => {
    if (type === 'emergency') {
      return count > 0 ? 'text-red-400' : 'text-gray-300';
    }
    return count > 0 ? 'text-blue-400' : 'text-gray-300';
  };

  const getBadgeColor = () => {
    if (type === 'emergency') {
      return 'bg-red-500';
    }
    return 'bg-blue-500';
  };

  const getAnimationClass = () => {
    if (!isAnimating) return '';
    return type === 'emergency' ? 'animate-bounce' : 'animate-pulse';
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className={`relative p-2 rounded-full hover:bg-gray-800/50 transition-all group ${className}`}
      aria-label={`${type} notifications`}
    >
      <Bell className={`w-6 h-6 ${getBellColor()} group-hover:text-white transition-colors ${getAnimationClass()}`} />
      
      {count > 0 && (
        <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center animate-bounce rounded-full ${getBadgeColor()} text-xs font-bold text-white ${getAnimationClass()}`}>
          {count > 9 ? '9+' : count}
        </span>
      )}
      
      {/* Connection indicator */}
      {!isConnected && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Connecting..." />
      )}
    </Link>
  );
} 