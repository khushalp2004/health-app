import React from 'react';
import 'react-phone-number-input/style.css'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
import { FormFieldType } from "@/components/forms/PatientForm";
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assuming you have a utility class helper
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Doctors } from '@/constants';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';


interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  className?: string; // Added for custom class names
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { fieldType, iconSrc, iconAlt, placeholder ,disabled,renderSkeleton} = props;
  
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className={cn(
          "flex items-center rounded border transition-colors bg-gray-950 border-gray-700",
          "focus-within:border-blue-700/55 focus-within:ring-1 focus-within:ring-blue-700/55",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          {iconSrc && (
            <div className="pl-3 pr-2 ">
              <Image 
                src={iconSrc} 
                alt={iconAlt || 'icon'} 
                width={20} 
                height={20} 
                className="text-muted-foreground"
              />
            </div>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              className={cn(
                "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                iconSrc ? "pl-0" : "pl-3"
              )}
            />
          </FormControl>
        </div>
      );

      case FormFieldType.PHONE_INPUT:
  return (
    <div
      className={cn(
        "flex items-center rounded border transition-colors bg-gray-950 border-gray-700",
        "focus-within:border-blue-700/55 focus-within:ring-1 focus-within:ring-blue-700/55",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <FormControl>
        <PhoneInput
          placeholder={placeholder}
          {...field}
          defaultCountry="IN"
          international
          withCountryCallingCode
          value={field.value as E164Number | undefined}
          onChange={field.onChange}
          className={cn(
            "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full",
            "text-gray-200 placeholder-gray-500", // Matching text colors
            "px-1 py-2", // Matching padding
            "phone-input-matched-style" // Custom class for deeper styling
          )}
        />
      </FormControl>
    </div>
  );

  case FormFieldType.DATE_PICKER:
  return (
    <div className={cn(
      "flex items-center rounded border transition-colors bg-gray-950 border-gray-700",
      "focus-within:border-blue-700/55 focus-within:ring-1 focus-within:ring-blue-700/55",
      disabled && "opacity-50 cursor-not-allowed"
    )}>

      {iconSrc && (
        <div className="pl-3 pr-2">
          <Image 
            src={iconSrc} 
            alt={iconAlt || 'icon'} 
            width={20} 
            height={20} 
            className="text-muted-foreground"
          />
        </div>
      )}
      <FormControl>
        <DatePicker
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          placeholderText={placeholder}
          disabled={disabled}
          showTimeSelect={props.showTimeSelect}
          dateFormat={props.dateFormat || (props.showTimeSelect ? "MMMM d, yyyy h:mm aa" : "MMMM d, yyyy")}
          className={cn(
            "w-full bg-transparent border-0 focus:outline-none focus:ring-0",
            "text-sm px-3 py-2 text-gray-200 placeholder-gray-500",
            iconSrc ? "pl-0" : "pl-3"
          )}
          calendarClassName="bg-gray-900 border border-gray-700 rounded shadow-lg"
          dayClassName={(date) => 
            cn(
              "hover:bg-gray-800 rounded",
              date.getDate() === field.value?.getDate() && "bg-blue-600 text-white"
            )
          }
        />
      </FormControl>
    </div>
  );

  case FormFieldType.SELECT:
  return (
    <div className={cn(
      "flex items-center rounded border transition-all bg-gray-950 border-gray-700",
      "focus-within:border-blue-700/55 focus-within:ring-2 focus-within:ring-blue-700/55",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      {iconSrc && (
        <div className="pl-3 pr-2">
          <Image 
            src={iconSrc} 
            alt={iconAlt || 'icon'} 
            width={20} 
            height={20} 
            className="text-gray-400"
          />
        </div>
      )}
      <FormControl>
        <Select 
          onValueChange={field.onChange} 
          value={field.value}  
        >
          <SelectTrigger className={cn(
            "w-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0",
            "text-sm px-4 py-3 text-gray-200 cursor-pointer",
            iconSrc ? "pl-2" : "pl-4",
            "flex items-center justify-between hover:bg-gray-900/50 transition-colors"
          )}>
            <div className="flex items-center gap-3">
              {field.value ? (
                <>
                  {Doctors.find(d => d.name === field.value) && (
                    <div className="relative w-8 h-8">
                      <Image
                        src={Doctors.find(d => d.name === field.value)?.image || ''}
                        alt={field.value}
                        fill
                        className="rounded-full object-cover border border-gray-700"
                      />
                    </div>
                  )}
                  <span className="font-medium">
                    {field.value || props.placeholder}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">{props.placeholder}</span>
              )}
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180"
            >
            </svg>
          </SelectTrigger>
          <SelectContent className={cn(
            "bg-gray-950 border border-gray-700 rounded-lg shadow-xl",
            "text-gray-200 z-50 py-1",
            "backdrop-blur-sm bg-opacity-90"
          )}>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {props.children}
            </div>
          </SelectContent>
        </Select>
      </FormControl>
    </div>
  );

  case FormFieldType.TEXTAREA:
  return (
    <div className={cn(
      "flex items-center rounded border transition-colors bg-gray-950 border-gray-700",
      "focus-within:border-blue-700/55 focus-within:ring-1 focus-within:ring-blue-700/55",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      {iconSrc && (
        <div className="pl-3 pr-2 pt-3"> {/* Adjusted padding for textarea */}
          <Image 
            src={iconSrc} 
            alt={iconAlt || 'icon'} 
            width={20} 
            height={20} 
            className="text-gray-400"
          />
        </div>
      )}
      <FormControl>
        <Textarea
          placeholder={placeholder}
          {...field}
          disabled={disabled}
          className={cn(
            "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full",
            "text-sm px-4 py-3 text-gray-200",
            "resize-y", // Allow vertical resizing
            "min-h-[100px]", // Minimum height
            iconSrc ? "pl-2" : "pl-4",
          )}
        />
      </FormControl>
    </div>
  );

  case FormFieldType.CHECKBOX:
  return (
    <FormControl>
      <div className="flex items-center gap-3">
        <Checkbox
          id={props.name}
          checked={field.value}
          onCheckedChange={field.onChange}
          className={cn(
            "h-5 w-5 rounded border-2 border-gray-700 bg-gray-950",
            "data-[state=checked]:bg-blue-700/55 data-[state=checked]:border-blue-700/55",
            "focus:ring-2 focus:ring-blue-700/55 focus:ring-offset-2 focus:ring-offset-gray-950",
            "transition-colors duration-200"
          )}
        />
        <Label
          htmlFor={props.name}
          className={cn(
            "text-sm font-medium leading-none text-gray-300",
            "hover:text-white cursor-pointer",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}
        >
          {props.label}
        </Label>
      </div>
    </FormControl>
  );

  case FormFieldType.SKELETON:
    return renderSkeleton ? renderSkeleton
    (field):null
    // Add other field types here
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label, className } = props;
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="text-sm font-medium leading-none">
              {label}
            </FormLabel>
          )}
          
          <RenderField field={field} props={props} />
          
          <FormMessage className="text-xs font-medium text-destructive" />
        </FormItem>
      )}
    />
  );
};



export default CustomFormField;