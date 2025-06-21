"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";
import "react-datepicker/dist/react-datepicker.css";
import AppointmentForm from "./forms/AppointmentForm";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
  title,
  description,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 rounded-md px-3 text-xs font-medium capitalize transition-colors ${
            type === "schedule"
              ? "bg-green-700/50 text-white hover:bg-green-700/40 hover:text-white rounded cursor-pointer"
              : "rounded bg-red-700/50 text-gray-300 hover:bg-red-700/40 hover:text-white cursor-pointer"
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-800 bg-gray-950 sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold text-white capitalize">
            {type} Appointment
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <AppointmentForm
            userId={userId}
            patientId={patientId}
            type={type}
            appointment={appointment}
            setOpen={setOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};