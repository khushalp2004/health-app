"use server"

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import {InputFile} from "node-appwrite/file";

export const createUser=async(user: CreateUserParams)=>{
    try{
        const newUser=await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log({newUser})
        return newUser;
    }catch(err:any){
        if(err && err?.code===409){
            const documents=await users.list([
                Query.equal('email',[user.email])
            ])

            return documents?.users[0];
        }
        console.error("Error creating user:", err);
        throw err;
    }
}

export const getUser=async(userId: string)=>{
    try{
        const user=await users.get(userId);

        return parseStringify(user);
    }catch(err){
        console.log(err);
    }
}

export const registerPatient=async({identificationDocument,...patient}:RegisterUserParams)=>{
    try{
        // Check if patient already exists for the user
        const existingPatients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal("userId", [patient.userId])]
        );

        if(existingPatients.documents.length > 0){
            return parseStringify(existingPatients.documents[0]);
        }

        let file;

        if(identificationDocument){
            const inputFile=InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file=await storage.createFile(BUCKET_ID!,ID.unique(),inputFile)
        }

        const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id && BUCKET_ID && PROJECT_ID
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

        return parseStringify(newPatient);
    }catch(err){
        console.error("An error occurred while creating a new patient:", err);
    }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};