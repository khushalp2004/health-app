import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const StatusBadge = ({status}:{status: Status}) => {
  return (
    <div className={clsx('flex w-fit items-center gap-2 rounded px-4 py-2',{
        'bg-green-600/20': status==='scheduled',
        'bg-blue-600/20': status==='pending',
        'bg-red-600/20': status==='cancelled',
    })}>

    <Image
    src={StatusIcon[status]}
    alt={status}
    width={24}
    height={24}
    className="w-3 h-fit"
  />    
  <p className={clsx('text-[12px] leading-[16px] font-semibold capitalize text-white',{
        'text-green-600': status==='scheduled',
        'text-blue-600': status==='pending',
        'text-red-600': status==='cancelled',
  })}>{status}</p>
      
    </div>
  )
}

export default StatusBadge
