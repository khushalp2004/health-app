"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType{
  INPUT='input',
  TEXTAREA='textarea',
  PHONE_INPUT='phone_input',
  CHECKBOX='checkbox',
  DATE_PICKER='date_picker',
  SELECT='select',
  SKELETON='skeleton'
}
 
const PatientForms = () =>{
  const router=useRouter();
  const [isLoading,setIsLoading]=useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try{
      const user={
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser=await createUser(user);

      if(newUser){
        router.push(`patients/${newUser.$id}/register`);
      }
    }catch(err){
      console.log(err);
    }

    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-7 space-y-4">
          <h1 className="header text-2xl">Hi there 👋</h1>
          <p className="text-gray-500 ">Schedule your first appointment</p>
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

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email address"
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

        <SubmitButton isLoading={isLoading}>
          Get Started
          </SubmitButton>
        
      </form>
    </Form>
  );
}

export default PatientForms
