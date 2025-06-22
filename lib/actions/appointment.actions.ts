"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  EMERGENCY_COLLECTION_ID,
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

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error("An error occurred while getting appointment:", error);
  }
};

export const getEmergencyAppointment = async (emergencyId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      EMERGENCY_COLLECTION_ID!,
      emergencyId
    );
    return parseStringify(appointment);
  } catch (err) {
    console.error(
      "An error occured while getting emergency appointment: ",
      err
    );
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "pending") {
          acc.pendingCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCounts: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (err) {
    console.error(err);
  }
};

export const getEmergencyRecentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      EMERGENCY_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const data = {
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (err) {
    console.error(err);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    const smsMessage = `
    Hi, it's Medislot. 
    ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule!).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform you that your appointment has been cancelled for the following reason:  ${appointment.cancellationReason}`
    }`;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (err) {
    console.error(err);
  }
};

export const updateEmergencyAppointment = async ({
  emergencyId,
  updates,
}: {
  emergencyId: string;
  updates: {
    markAsDone?: string;
    status?: string;
    // Add other possible fields you might update
  };
}) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      EMERGENCY_COLLECTION_ID!,
      emergencyId,
      updates // Pass the entire updates object
    );

    if (!updatedAppointment) {
      throw new Error("Emergency appointment not found");
    }

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (err) {
    console.error("Error updating emergency appointment:", err);
    throw err; // Re-throw the error to handle it in the UI component
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (err) {
    console.error(err);
  }
};

// export const getBellNotification=async()=>{
//     try{
//       const appointments=await databases.listDocuments(
//         DATABASE_ID!,
//         EMERGENCY_COLLECTION_ID!,
//         [Query.equal("markAsdone","0")]
//       );

//       const data={
//         document: appointments.documents,
//       };

//       return parseStringify(data);
//     }catch(err){
//       console.log(err);
//     }
// };

export const getBellNotification = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      EMERGENCY_COLLECTION_ID!,
      [
        Query.equal("markAsDone", "0"), // Note: Case-sensitive field name
        Query.select(["$id"]) // Only fetch IDs to optimize performance
      ]
    );

    return {
      count: appointments.total, // Returns the total count of matching documents
      documents: parseStringify(appointments.documents)
    };
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return {
      count: 0,
      documents: []
    };
  }
};


export const getNormalBellNotification = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("status", "pending"), // Note: Case-sensitive field name
        Query.select(["$id"]) // Only fetch IDs to optimize performance
      ]
    );

    return {
      count: appointments.total, // Returns the total count of matching documents
      documents: parseStringify(appointments.documents)
    };
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return {
      count: 0,
      documents: []
    };
  }
};