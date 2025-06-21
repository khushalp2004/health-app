import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Logo/Header - Changed to text only like screenshot */}
        <Link href="/" className="flex mt-5 mb-8 gap-2 cursor-pointer">
<Image
src="/logo.png"
alt="logo"
width={40}
height={30}
className="rounded-lg"
/>
<h1 className="text-4xl font-bold text-white">MediSlot</h1>
</Link>
        <div className="mb-8 flex h-30 w-30 items-center justify-center rounded-full bg-green-900/30">
<Image
src="/success.gif"
alt="success"
width={400}
height={400}
className=""
/>
</div>
        {/* Success Message - Simplified like screenshot */}
        <section className="mb-8 flex flex-col items-center">
          <h1 className="mb-4 text-3xl font-medium text-white">
            Your <span className="text-blue-500">appointment</span> request has been
            successfully submitted!
          </h1>
          <p className="text-gray-400 text-sm">
            We will be in touch shortly to confirm.
          </p>
        </section>

        {/* Appointment Details - Minimalist like screenshot */}
        <section className="mb-8 w-full max-w-xs text-center">
          <h3 className="mb-4 text-sm font-medium text-gray-400">
            Requested appointment details
          </h3>
          <div className="w-full max-w-md rounded border border-gray-700/55 bg-blue-700/10 p-6">
  
  <div className="space-y-4">
    {/* Doctor */}
    <div className="items-center flex gap-4">
      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500/30">
        <Image
          src={doctor?.image!}
          alt={doctor?.name || "Doctor"}
          fill
          className="object-cover"
        />
      </div>
      <div className="">
        <p className="font-medium text-white">Dr. {doctor?.name}</p>
        {/* <p className="ml-0 text-sm text-gray-400">{doctor?.specialization}</p> */}
      </div>
    </div>

    {/* Date & Time */}
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/20">
        <Image 
          src="/calendar.svg"
          width={25}
          height={25}
          alt="Calendar"
          className="opacity-90"
        />
      </div>
      <div>
        <p className="font-medium text-white">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      </div>
    </div>

    {/* Reason */}
    {appointment.reason && (
      <div className="items-center flex gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20">
          <Image 
            src="/reason.png"
            width={30}
            height={30}
            alt="Reason"
            className="invert-100"
          />
        </div>
        <div className="flex items-center flex-col">
          {/* <p className="font-medium text-white">Visit Reason</p> */}
          <p className="text-medium text-gray-300">{appointment.reason}</p>
        </div>
      </div>
    )}
  </div>
</div>
        </section>

        {/* New Appointment Button - Centered like screenshot */}
        <Button
          variant="outline"
          className="mt-4 rounded-md border-blue-800/55 bg-blue-800 text-white hover:bg-blue-700 hover:text-white"
          asChild
        >
          <Link href={`/patients/${userId}/new-appointment`}>
            Schedule another
          </Link>
        </Button>

        {/* Footer - Simple like screenshot */}
        <p className="mt-6 text-sm text-gray-500">© 2024 MediSlot</p>
      </div>
    </div>
  );
};

export default Success;