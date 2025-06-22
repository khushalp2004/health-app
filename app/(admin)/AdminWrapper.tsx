'use client'

import { useEffect, useState } from 'react';;
import { getBellNotification, getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import { useSocket } from '../context/SocketContext';
import Admin from '../admin/page';

export default function AdminWrapper() {
  const { socket, isConnected } = useSocket();
  const [appointments, setAppointments] = useState<any>(null);
  const [emergencyCount, setEmergencyCount] = useState(0);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, emergencyData] = await Promise.all([
          getRecentAppointmentList(),
          getBellNotification()
        ]);
        
        setAppointments(appointmentsData);
        setEmergencyCount(emergencyData.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    const onNewAppointment = (data: any) => {
      setAppointments(prev => ({
        ...prev,
        documents: [data, ...prev.documents],
        scheduledCount: prev.scheduledCount + (data.status === 'scheduled' ? 1 : 0),
        pendingCount: prev.pendingCount + (data.status === 'pending' ? 1 : 0),
        cancelledCount: prev.cancelledCount + (data.status === 'cancelled' ? 1 : 0)
      }));
    };

    const onUpdateAppointment = (data: any) => {
      setAppointments(prev => {
        const oldAppointment = prev.documents.find(a => a.$id === data.$id);
        if (!oldAppointment) return prev;

        const statusChanges = {
          scheduled: 0,
          pending: 0,
          cancelled: 0
        };

        if (oldAppointment.status !== data.status) {
          statusChanges[oldAppointment.status] -= 1;
          statusChanges[data.status] += 1;
        }

        return {
          ...prev,
          documents: prev.documents.map(a => 
            a.$id === data.$id ? data : a
          ),
          scheduledCount: prev.scheduledCount + statusChanges.scheduled,
          pendingCount: prev.pendingCount + statusChanges.pending,
          cancelledCount: prev.cancelledCount + statusChanges.cancelled
        };
      });
    };

    const onNewEmergency = () => {
      setEmergencyCount(prev => prev + 1);
    };

    socket.on('newAppointment', onNewAppointment);
    socket.on('updateAppointment', onUpdateAppointment);
    socket.on('newEmergency', onNewEmergency);

    return () => {
      socket.off('newAppointment', onNewAppointment);
      socket.off('updateAppointment', onUpdateAppointment);
      socket.off('newEmergency', onNewEmergency);
    };
  }, [socket]);

  if (!appointments) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <Admin appointments={appointments} emergencyCount={emergencyCount} />;
}