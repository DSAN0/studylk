import React from 'react'
import { BookOpen, CheckCircle2, Clock, Target } from 'lucide-react'
import { Card } from '../../../../components/ui/card'

export default function MetricCards({
  enrollmentsCount = 0,
  approvedCount = 0,
  pendingCount = 0,
  onGoToTab,
}) {
  const metrics = [
    {
      label: 'Enrolled Courses',
      value: enrollmentsCount,
      icon: BookOpen,
      color: 'emerald',
      tab: 'courses',
      bgClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Active & Approved',
      value: approvedCount,
      icon: CheckCircle2,
      color: 'green',
      tab: 'courses',
      bgClass: 'bg-green-50 text-green-700',
    },
    {
      label: 'Pending Verification',
      value: pendingCount,
      icon: Clock,
      color: 'amber',
      tab: 'courses',
      bgClass: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Goals & Targets',
      value: 'Study Daily',
      icon: Target,
      color: 'purple',
      tab: 'goals',
      bgClass: 'bg-purple-50 text-purple-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <Card
            key={idx}
            onClick={() => onGoToTab(m.tab)}
            className="flex cursor-pointer items-center gap-4 p-5 transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md bg-white border-emerald-100"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${m.bgClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#1A3A1A]">
                {m.value}
              </div>
              <div className="text-xs font-semibold text-zinc-500">
                {m.label}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
