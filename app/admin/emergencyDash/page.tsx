import { columns } from "@/components/emergencyTable/columns";
import { DataTable } from "@/components/table/DataTable";
import RealTimeNotificationBell from "@/components/ui/RealTimeNotificationBell";
import RealTimeRegularAlert from "@/components/ui/RealTimeRegularAlert";
import SocketDebugger from "@/components/ui/SocketDebugger";
import TestNotificationButtons from "@/components/ui/TestNotificationButtons";
import { getEmergencyRecentList, getNormalBellNotification } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";

const EmergencyDash = async () => {
  const appointments = await getEmergencyRecentList();
  const { count: normalCount } = await getNormalBellNotification();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      {/* Header Section - Matching the admin page style */}
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
            Emergency Dashboard
          </div>
          
          <RealTimeNotificationBell
            type="regular"
            initialCount={normalCount}
            href="/admin"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white"><span className="text-red-400">Emergency</span> Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Manage urgent appointments and critical cases
              </p>
            </div>

            <RealTimeRegularAlert
              initialCount={normalCount}
              href="/admin"
            />
          </div>
        </section>

        {/* Emergency Appointments Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Emergency Appointments</h2>
          </div>
          <DataTable 
            columns={columns} 
            data={appointments.documents}
          />
        </section>
      </main>

      {/* Test Notification Buttons - Remove in production */}
      {/* <TestNotificationButtons /> */}
      <SocketDebugger />
    </div>
  );
};

export default EmergencyDash;