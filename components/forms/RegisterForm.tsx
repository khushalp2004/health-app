"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { FileUploader } from "../FileUploader";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CheckCircleIcon } from "lucide-react";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    //@ts-ignore
    resolver: zodResolver(PatientFormValidation),
    //@ts-ignore
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length>0){
        const blobFile=new Blob([values.identificationDocument[0]],{
          type: values.identificationDocument[0].type
        })

        formData=new FormData();
        formData.append('blobFile',blobFile);
        formData.append('fileName',values.identificationDocument[0].name);
    }
    try {

      const patientData={
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      //@ts-ignore
      const patient=await registerPatient(patientData);

      if(patient){
        router.push(`/patients/${user.$id}/new-appointment`);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Form {...form}>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-7 space-y-4">
          <h1 className="header text-2xl mb-1">Welcome 👋</h1>
          <p className="text-gray-500 ">Tells us more about yourself . </p>
        </section>
        <section className="mb-5 space-y-4">
          <h1 className="header text-[19px]">Personal Information</h1>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          iconSrc="/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            iconSrc="/email.svg"
            iconAlt="user"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="Enter your mobile number"
            iconSrc="/email.svg"
            iconAlt="user"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            placeholder="Date of Birth"
            iconSrc="/calendar.svg"
            iconAlt="calendar"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-3"
                >
                  {GenderOptions.map((option) => (
                    <div
                      key={option}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border border-gray-700 bg-gray-950 px-2 py-2",
                        "hover:border-blue-700/55 hover:ring-1 hover:ring-blue-700/55",
                        "has-[:checked]:border-blue-700 has-[:checked]:ring-1 has-[:checked]:ring-blue-700",
                        "transition-colors duration-200 text-sm"
                      )}
                    >
                      <RadioGroupItem
                        value={option}
                        id={option}
                        className={cn(
                          "h-4 w-4 text-blue-600 border-gray-600",
                          "focus:ring-blue-600 focus:ring-offset-gray-950",
                          "hover:border-blue-600"
                        )}
                      />
                      <Label
                        htmlFor={option}
                        className={cn(
                          "cursor-pointer text-sm font-medium leading-none",
                          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        )}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="Enter your address"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian Name"
            iconSrc="/user.svg"
            iconAlt="user"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="Enter your mobile number"
          />
        </div>
        <Separator className="my-4 bg-gray-700 mb-5" />

        <section>
          <div className="mb-5 space-y-1">
            <h1 className="header text-[19px]">Medical Information</h1>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Who is your Insurance Provider?"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="Enter your policy number"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medication (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had brain cancer, Father had heart disease"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>

        <Separator className="my-4 bg-gray-700 mb-5" />

        <section>
          <div className="mb-5 space-y-1">
            <h1 className="header text-[19px]">
              Identification and Verification
            </h1>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem
              key={type}
              value={type}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 focus:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <span className="text-white">{type}</span>
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <div
                className={cn(
                  "rounded-lg border-2 border-dashed border-gray-700 bg-gray-950/50 p-6",
                  "hover:border-blue-600/55 hover:bg-gray-900/30 transition-colors duration-200",
                  "focus-within:border-blue-600/55 focus-within:ring-2 focus-within:ring-blue-600/30"
                )}
              >
                <FileUploader
                  files={field.value}
                  onChange={field.onChange}
                  dropzoneOptions={{
                    accept: {
                      "image/*": [".jpeg", ".jpg", ".png", ".pdf"],
                    },
                    maxFiles: 1,
                    maxSize: 5 * 1024 * 1024, // 5MB
                  }}
                  className="flex flex-col items-center justify-center space-y-4 text-center"
                >
                  <div className="p-3 rounded-full bg-blue-600/10">
                    <FaCloudUploadAlt />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      Drag & drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, PDF (Max 5MB)
                    </p>
                  </div>
                  {field.value?.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      {/* <span>{field.value.length} file selected</span> */}
                      <span>File selected</span>
                    </div>
                  )}
                </FileUploader>
              </div>
            </FormControl>
          )}
        />

        <Separator className="bg-gray-700 mb-5"/>

        <section>
          <div className="mb-5 space-y-1">
            <h1 className="header text-[19px]">
              Consent and Privacy
            </h1>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading} className="cursor-pointer">Complete your profile</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
