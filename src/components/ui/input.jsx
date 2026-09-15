import React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-emerald-100 bg-white px-3.5 py-2 text-sm text-[#1A3A1A] placeholder:text-zinc-400 focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'
