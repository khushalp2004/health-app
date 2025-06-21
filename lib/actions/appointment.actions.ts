"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    // revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

export const getAppointment=async(appointmentId: string)=>{
  try{
    const appointment=await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    )
    return parseStringify(appointment);
  }catch(error){
    console.error("An error occurred while getting appointment:", error);
  }
}

export const getRecentAppointmentList=async()=>{
  try{
    const appointments=await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    )

    const initialCounts={
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0
    }

    const counts=(appointments.documents as Appointment[]).reduce((acc,appointment)=>{
      if(appointment.status==="scheduled"){
        acc.scheduledCount++;
      }else if(appointment.status==="pending"){
        acc.pendingCount++;
      }else if(appointment.status==="cancelled"){
        acc.cancelledCount++;
      }
      return acc;
    },initialCounts);

    const data={
      totalCounts: appointments.total,
      ...counts,
      documents: appointments.documents
    }

    return parseStringify(data);
  }catch(err){
    console.error(err);
  }
}

export const updateAppointment=async({appointmentId,userId,appointment,type}:UpdateAppointmentParams)=>{
  try{
    const updatedAppointment=await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    )

    if(!updatedAppointment){
      throw new Error("Appointment not found");
    }

    //sms notification

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  }catch(err){
    console.error(err);
  }
}
