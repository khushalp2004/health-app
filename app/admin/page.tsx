import { columns } from "@/components/table/columns";
import {DataTable} from "@/components/table/DataTable";
import StatCard from "@/components/ui/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Admin = async() => {
    const appointments=await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-6xl flex-col space-y-14 m-1">
      <header className="sticky top-3 z-20 mx-3 flex items-center justify-between rounded-lg bg-gray-900/60 px-[5%] py-5 shadow-sm shadow-gray-700 xl:px-12 ">
        <Link href="/" className="flex items-center justify-start m-2">
          <Image
            src="/logo.png"
            width={28}
            height={28}
            alt="MediSlot Logo"
            className="rounded-lg"
          />
          <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            MediSlot
          </span>
        </Link>
        <p className="font-bold">Admin Dashboard</p>
      </header>

      <main className="flex flex-col items-center mt-5 space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12">
        <section className="w-full space-y-4">
          <h1 className="text-4xl font-bold">Welcome 👋</h1>
          <p className="text-gray-200 text-[13px]">
            Start the day with managing new appointment
          </p>
        </section>

        <section className="flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents}/>
      </main>
    </div>
  );
};

export default Admin;
