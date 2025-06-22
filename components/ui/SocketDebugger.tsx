"use client";

import { useSocketContext } from '@/components/providers/SocketProvider';
import { useState, useEffect } from 'react';

export default function SocketDebugger() {
  const { socket, isConnected } = useSocketContext();
  const [showDebug, setShowDebug] = useState(false);
  const [connectionLog, setConnectionLog] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    const addLog = (message: string) => {
      setConnectionLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    addLog(`Socket created: ${socket.id}`);

    socket.on('connect', () => {
      addLog('Connected to server');
    });

    socket.on('disconnect', (reason) => {
      addLog(`Disconnected: ${reason}`);
    });

    socket.on('connect_error', (error) => {
      addLog(`Connection error: ${error.message}`);
    });

    socket.on('reconnect', (attemptNumber) => {
      addLog(`Reconnected after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_error', (error) => {
      addLog(`Reconnection error: ${error.message}`);
    });

    socket.on('reconnect_failed', () => {
      addLog('Reconnection failed');
    });

    socket.on('admin-connected', (data) => {
      addLog(`Admin room joined: ${JSON.stringify(data)}`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('reconnect');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
      socket.off('admin-connected');
    };
  }, [socket]);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed top-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-xs z-50"
      >
        Debug Socket
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-gray-900 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Socket.IO Debug</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="mb-2">
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      {socket && (
        <div className="mb-2">
          <div>Socket ID: {socket.id}</div>
          <div>Connected: {socket.connected ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      <div className="mb-2">
        <button
          onClick={() => {
            if (socket) {
              socket.emit('admin-connect', 'admin');
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs mr-2"
        >
          Rejoin Admin
        </button>
        
        <button
          onClick={() => {
            if (socket) {
              socket.disconnect();
            }
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Disconnect
        </button>
      </div>
      
      <div className="max-h-32 overflow-y-auto bg-gray-800 p-2 rounded text-xs">
        {connectionLog.map((log, index) => (
          <div key={index} className="mb-1">{log}</div>
        ))}
      </div>
    </div>
  );
} 