import clsx from 'clsx'
import Image from 'next/image';
import React from 'react'

interface StatCardProps{
    type: 'appointments'| 'pending' | 'cancelled'
    count: number,
    label: string,
    icon: string,
}

const StatCard = ({count=0,label,icon,type}:StatCardProps) => {
  return (
    <div className=''>
    <div
     className={clsx("flex flex-1 w-[300px] flex-col gap-6 rounded bg-cover p-6 shadow-lg", {
    [`bg-[url('/images/appointments-bg.png')]`]: type === "appointments",
    [`bg-[url('/images/pending-bg.png')]`]: type === "pending",
    [`bg-[url('/images/cancelled-bg.png')]`]: type === "cancelled",
  })}
    >
        <div className="flex items-center gap-4">
            <Image
            src={icon}
            alt="icon"
            width={30}
            height={30}/>
            <h2 className='font-bold text-2xl'>{count}</h2>
        </div>

        <p>{label}</p>
      
    </div>
    </div>
    
  );
}

export default StatCard
