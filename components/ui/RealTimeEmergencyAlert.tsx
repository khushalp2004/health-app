"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSocketContext } from '@/components/providers/SocketProvider';
import { toast } from 'sonner';

interface RealTimeEmergencyAlertProps {
  initialCount: number;
  href: string;
  className?: string;
}

export default function RealTimeEmergencyAlert({ 
  initialCount, 
  href, 
  className = "" 
}: RealTimeEmergencyAlertProps) {
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available yet for emergency alert...');
      return;
    }

    console.log('Setting up emergency alert listener...');

    const handleEmergency = (data: any) => {
      console.log('Emergency alert notification received:', data);
      setCount(prev => prev + 1);
      setIsAnimating(true);
      
      // Show toast notification
      toast.error(`🚨 New Emergency: ${data.name} - ${data.reason}`, {
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
  }, [socket, href]);

  // Reset count when navigating to the page
  const handleClick = () => {
    setCount(0);
    setIsAnimating(false);
  };

  const getAnimationClass = () => {
    if (!isAnimating) return '';
    return 'animate-pulse-once';
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${count > 0 
        ? `bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 ${getAnimationClass()}` 
        : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 relative">
          <div className={`w-5 h-5 border-2 border-red-500 rounded-full ${count > 0 ? 'animate-ping' : ''} absolute`}></div>
          <div className="w-5 h-5 border-2 border-red-500 rounded-full relative"></div>
        </div>
        <span className="font-semibold text-lg">
          {count > 0 
            ? `${count} Emergency Alert${count > 1 ? 's' : ''}!` 
            : "No emergency alert"}
        </span>
      </div>
      {count > 0 && (
        <span className="ml-2 px-2 py-1 rounded bg-red-600/90 text-white text-sm">
          View Now
        </span>
      )}
      
      {/* Connection indicator */}
      {!isConnected && (
        <div className="ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Connecting..." />
      )}
    </Link>
  );
} 