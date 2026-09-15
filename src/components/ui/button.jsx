import React from 'react'
import { cn } from '../../lib/utils'

export function Button({
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer'

  const variants = {
    default:
      'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-sm hover:from-emerald-700 hover:to-green-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100',
    outline:
      'border border-zinc-200 bg-white hover:bg-emerald-50/50 hover:text-emerald-900 text-zinc-700 hover:border-emerald-300',
    ghost:
      'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700',
    danger:
      'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300',
  }

  const sizes = {
    default: 'h-10 px-5 py-2 text-sm rounded-full',
    sm: 'h-8 px-3.5 text-xs rounded-full',
    lg: 'h-12 px-7 text-base rounded-full',
    icon: 'h-9 w-9 p-0 rounded-full',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
