"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import StatusBadge from "../StatusBadge";
import { AppointmentModal } from "../AppointmentModal";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-white">
          {row.index + 1}
        </p>
      );
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-sm font-medium text-white">
          {appointment.patient.name}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[120px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[140px]">
          <p className="text-sm text-white">
            {formatDateTime(appointment.schedule).dateOnly}
          </p>
          <p className="text-xs text-blue-400">
            {formatDateTime(appointment.schedule).timeOnly}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;
      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-700">
            <Image
              src={doctor?.image!}
              alt={doctor?.name || "Doctor"}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm font-medium text-white">
            Dr. {doctor?.name}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-2">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex justify-end gap-2 pr-2">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
  
];