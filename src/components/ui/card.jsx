import React from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-emerald-100/90 bg-white p-6 text-[#1A3A1A] shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-md hover:border-emerald-200',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-lg font-bold leading-none tracking-tight text-[#1A3A1A]', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-zinc-500', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center pt-4', className)} {...props} />
}
