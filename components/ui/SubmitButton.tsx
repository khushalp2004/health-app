import React from 'react'
import Image from 'next/image';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ButtonProps{
    isLoading?: boolean;
    className?: string,
    children?: React.ReactNode
}

const SubmitButton = ({isLoading,children}:ButtonProps) => {
  return (
    <Button
          type="submit"
          className={cn("bg-gray-200 text-black shadow-lg shadow-white-500/20  hover:bg-blue-700/80 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 text-sm px-4 py-2 rounded font-medium transition duration-150 ease-in-out w-full cursor-pointer",
            isLoading && 'bg-white text-white cursor-not-allowed',
          )}
          disabled={isLoading}

        >
            {isLoading ? (
                <div className='flex items-center gap-4'>
                    <Image src="/loader.svg" alt="loader" width={24} height={24} className='animate-spin invert-100' />
                    
                </div>
            ):children}
        </Button>
  )
}

export default SubmitButton
