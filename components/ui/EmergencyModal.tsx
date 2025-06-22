"use client";

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';
import SubmitButton from './SubmitButton';
import CustomFormField from '../CustomFormField';
import { Doctors } from '@/constants';
import { SelectItem } from './select';
import { Form } from './form';
import { EmergencyFormValidation } from '@/lib/validation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emergencyAppointment } from '@/types/appwrite.types';
import { createEmergency } from '@/lib/actions/patient.actions';

export enum FormFieldType{
  INPUT='input',
  TEXTAREA='textarea',
  PHONE_INPUT='phone_input',
  CHECKBOX='checkbox',
  DATE_PICKER='date_picker',
  SELECT='select',
  SKELETON='skeleton'
}

const EmergencyModal = ({
    appointment,
}:{
    userId: string;
    appointment?: emergencyAppointment;
})  => {
    const router=useRouter();
    const path=usePathname();
    const [open,setOpen]=useState(false);
    const [isLoading,setIsLoading]=useState(false);

     useEffect(() => {
        if (path === '/emergency') {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [path]);

    const form = useForm<z.infer<typeof EmergencyFormValidation>>({
        resolver: zodResolver(EmergencyFormValidation),
        defaultValues: {
          name: appointment ? appointment.name : "",
          phone: appointment ? appointment.phone : "",
          primaryPhysician: appointment ? appointment.primaryPhysician : "",
          reason: appointment ? appointment.reason : "",
          markAsDone: "0",
          cancellationReason: appointment ? appointment.cancellationReason ?? undefined : undefined,
          emergencyDate: appointment 
      ? new Date(appointment.schedule) 
      : new Date(Date.now() + 15 * 60 * 1000)
        },
      });

    async function onSubmit(values: z.infer<typeof EmergencyFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true);
        try{
          const userEmergency = {
            name: values.name,
            phone: values.phone,
            primaryPhysician: values.primaryPhysician,
            reason: values.reason,
            markAsDone: "0",
            cancellationReason: values.cancellationReason,
            emergencyDate: new Date(values.emergencyDate),
          };
    
          const newEmergency = await createEmergency(userEmergency);
          console.log("new emergency appointment", newEmergency);
    
          if(newEmergency){
            router.push(`emergency/success?emergencyId=${newEmergency.$id}`);
            // success?appointmentId=${newAppointment.$id}
          }
        }catch(err){
          console.log(err);
        }
    
        setIsLoading(false);
      }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center justify-between text-3xl mb-3">
        <header className='text-3xl mb-3 text-red-500'>Emergency ? </header>
        <Image
                      src="/close.svg"
                      alt="close"
                      width={20}
                      height={20}
                      onClick={() => {setOpen(false);
                      router.push("/");}}
                      className="cursor-pointer"
                    />
      </AlertDialogTitle>
      <AlertDialogDescription>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          <>
          <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                className="w-full"
              />

               <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone"
                className="w-full"
              />
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
              name="emergencyDate"
              label="Emergency Appointment (default after 15 minutes)"
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

         <SubmitButton 
        isLoading={isLoading} className='w-[200px]'
        >Schedule</SubmitButton>

      </form>
    </Form>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className='bg-red-500'>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default EmergencyModal
