"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { emergencyAppointment } from "@/types/appwrite.types";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {  useTransition } from "react";
import { Toaster } from "@/components/ui/sonner"
import { updateEmergencyAppointment } from "@/lib/actions/appointment.actions";
import { toast } from "sonner";

export const columns: ColumnDef<emergencyAppointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-sm font-medium text-white">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-sm font-medium text-white">{appointment.name}</p>
      );
    },
  },
  {
    accessorKey: "emergencyDate",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[140px]">
          <p className="text-sm text-white">
            {formatDateTime(appointment.emergencyDate).dateOnly}
          </p>
          <p className="text-xs text-blue-400">
            {formatDateTime(appointment.emergencyDate).timeOnly}
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
          <p className="text-sm font-medium text-white">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-sm font-medium text-white">{appointment.reason}</p>
      );
    },
  },

  {
  accessorKey: "markAsDone",
  header: "Status",
  cell: ({ row }) => {
    const appointment = row.original;
    const [isPending, startTransition] = useTransition();

    const handleToggleStatus = async () => {
      startTransition(async () => {
        try {
          const newStatus = appointment.markAsDone === "1" ? "0" : "1";
          await updateEmergencyAppointment({
            emergencyId: appointment.$id,
            updates: {
              markAsDone: newStatus
            }
          });
          // Optional: Add toast notification
          toast.success(`Status ${newStatus === "1" ? "marked" : "unmarked"}`);
        } catch (error) {
          toast.error("Failed to update status");
          console.error("Update failed:", error);
        }
      });
    };

    return (
      <div className="text-sm font-medium text-white">
        <Button
          onClick={handleToggleStatus}
          disabled={isPending}
          className={`cursor-pointer rounded transition-colors ${
            appointment.markAsDone === "0" 
              ? "bg-green-600 hover:bg-green-700 hover:text-white" 
              : "bg-gray-600 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {isPending ? <>
            {/* <Image
              src="/loader.svg"
              alt="Loading"
              width={18}
              height={18}
              className="animate-spin inline-block"
              /> */}
              Loading....
          </> : 
           appointment.markAsDone === "1" ? "Unmark as done" : "Mark as done"}
        </Button>
      </div>
    );
  },
}
];
