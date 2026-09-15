import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { cn } from '../../../../lib/utils'

export default function CourseFilters({
  searchQuery,
  setSearchQuery,
  courseFilter,
  setCourseFilter,
  allCount = 0,
  approvedCount = 0,
  pendingCount = 0,
}) {
  const filterButtons = [
    { id: 'all', label: `All (${allCount})` },
    { id: 'approved', label: `Approved (${approvedCount})` },
    { id: 'pending', label: `Pending (${pendingCount})` },
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {filterButtons.map(btn => {
          const isActive = courseFilter === btn.id
          return (
            <button
              key={btn.id}
              onClick={() => setCourseFilter(btn.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer',
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
              )}
            >
              {btn.label}
            </button>
          )
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search course or teacher..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 pr-8"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
