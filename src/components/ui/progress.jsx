import React from 'react'
import { cn } from '../../lib/utils'

export function Progress({ value = 0, max = 100, className, barClassName, ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-emerald-100/60 dark:bg-emerald-950/60', className)}
      {...props}
    >
      <div
        className={cn('h-full w-full flex-1 bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300 ease-in-out', barClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
}
