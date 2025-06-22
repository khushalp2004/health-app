"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { getAppointmentSchema, CreateAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone_input",
  CHECKBOX = "checkbox",
  DATE_PICKER = "date_picker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen:(open: boolean)=> void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const AppointmentFormValidation=getAppointmentSchema(type);

  console.log(appointment);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician: '',
      schedule: appointment ? new Date(appointment.schedule): new Date(),
      reason: appointment ? appointment.note: '',
      note: appointment ? appointment.note : '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    console.log("IM SUBMITTING",{type});
    setIsLoading(true);

    let status;

    switch(type){
        case 'schedule':
            status="scheduled"
            break;
        case 'cancel':
            status="cancelled"
            break;
        default:
            status='pending'
            break;
    }

    console.log('BEFORE THE TYPE',{type})

    try {
      if(type==='create' && patientId){
        console.log("IM HERE")
        const appointmentData={
            userId,
            patient: patientId,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values.reason!,
            note: values.note,
            status: status as Status
        }

        const newAppointment=await createAppointment(appointmentData);

        // console.log('Here is the error ',newAppointment);
        console.log("new appointment", newAppointment);

        if(newAppointment){
            form.reset();
            router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`);
            console.log(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`);
          // router.push('www.google.com');
        }
      }else{
        console.log('Updating appointment');
        const appointmentToUpdate={
          userId,
          appointmentId: appointment?.$id!,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment:{
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type
        }
        const updatedAppointment=await updateAppointment(appointmentToUpdate);

        if(updatedAppointment){
          setOpen && setOpen(false);
          form.reset();
        }
      }

    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  }

  let buttonLabel;

  switch(type){
    case 'cancel':
        buttonLabel="Cancel Appointment";
        break;
    case 'create':
        buttonLabel="Create Appointment";
        break;
    case 'schedule':
        buttonLabel = 'Schedule Appointment';
        break;
    default:
        buttonLabel = "Create Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type==='create' &&
        <section className="mb-7 space-y-4">
          <h1 className="header text-2xl">New Appointment👋</h1>
          <p className="text-gray-500 ">
            Request a new appointment in 10 seconds
          </p>
        </section>
}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
              iconSrc='/images/search.svg'
            >
              {Doctors.map((doctor) => (
                <SelectItem
                  key={doctor.name}
                  value={doctor.name}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 focus:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        fill
                        className="rounded-full object-cover border-2 border-gray-700"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">{doctor.name}</p>
                      {doctor.specialization && (
                        <p className="text-sm text-gray-400 mt-1">
                          {doctor.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              placeholder="Schedule date"
              showTimeSelect
              dateFormat="MM/dd/yyyy-h:mm aa"
              iconSrc="/calendar.svg"
              iconAlt="calendar"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
                className="w-full"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
                className="w-full"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="cancellationReason"
              label="Reason for cancellation"
              placeholder="Enter reason for cancellation"
            />
          </>
        )}

                <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "bg-red-500" : "bg-blue-700/55"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>

      </form>
    </Form>
  );
};

export default AppointmentForm;
