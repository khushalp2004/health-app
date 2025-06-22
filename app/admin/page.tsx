import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import StatCard from "@/components/ui/StatCard";
import RealTimeNotificationBell from "@/components/ui/RealTimeNotificationBell";
import RealTimeEmergencyAlert from "@/components/ui/RealTimeEmergencyAlert";
import TestNotificationButtons from "@/components/ui/TestNotificationButtons";
import SocketDebugger from "@/components/ui/SocketDebugger";
import { getBellNotification, getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";

const Admin = async () => {
  const appointments = await getRecentAppointmentList();
  const { count: emergencyCount } = await getBellNotification();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Header Section */}
      <header className="sticky top-3 z-20 flex items-center justify-between rounded-lg bg-gray-900/80 backdrop-blur-sm p-4 shadow-md border border-gray-800">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="MediSlot Logo"
            className="rounded-lg transition-transform group-hover:scale-105"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            MediSlot
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-lg font-medium text-gray-300">
            Regular Dashboard 
          </div>
          
          <RealTimeNotificationBell
            type="emergency"
            initialCount={emergencyCount}
            href="/admin/emergencyDash"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome Back 👋</h1>
              <p className="text-gray-400 mt-1">
                Manage today's appointments and emergencies
              </p>
            </div>

            <RealTimeEmergencyAlert
              initialCount={emergencyCount}
              href="/admin/emergencyDash"
            />
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled"
            icon="/appointments.svg"
            // trend="up"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending Approval"
            icon="/pending.svg"
            // trend="neutral"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled"
            icon="/cancelled.svg"
            // trend="down"
          />
        </section>

        {/* Recent Appointments Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Appointments</h2>
          </div>
          <DataTable 
            columns={columns} 
            data={appointments.documents} 
            // className="border border-gray-800 rounded-lg"
          />
        </section>
      </main>

      {/* Test Notification Buttons - Remove in production */}
      {/* <TestNotificationButtons /> */}
      
      {/* Socket Debugger - Remove in production */}
      {/* <SocketDebugger />    debug the socket connection */}
    </div>
  );
};

export default Admin;