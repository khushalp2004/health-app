// components/ui/FileUploader.tsx
"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, CheckCircleIcon } from 'lucide-react'; // or your preferred icon library
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  className?: string;
  dropzoneOptions?: any;
  children?: React.ReactNode;
}

export function FileUploader({
  files,
  onChange,
  className,
  dropzoneOptions,
  children
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...dropzoneOptions
  });

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "cursor-pointer w-full",
        isDragActive && "bg-blue-900/10",
        className
      )}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="p-8 text-center">
          <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">
            Drag files here or click to upload
          </p>
        </div>
      )}
    </div>
  );
}