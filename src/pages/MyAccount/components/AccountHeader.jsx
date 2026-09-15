import React from 'react'
import { GraduationCap, CheckCircle2, BookOpen, Sparkles } from 'lucide-react'
import { Badge } from '../../../components/ui/badge'

export default function AccountHeader({
  studentName = 'Student',
  enrollmentsCount = 0,
  approvedCount = 0
}) {
  const initial = studentName ? studentName.charAt(0).toUpperCase() : 'S'

  return (
    <header className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-emerald-100/30 to-green-50 px-4 py-8 md:px-8">
      {/* Subtle Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#059669 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left User Identity */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-2xl font-black text-white shadow-lg shadow-emerald-700/25 ring-4 ring-white">
            {initial}
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 ring-2 ring-emerald-500/20" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1 bg-white py-0.5 text-xs text-emerald-800 shadow-sm border border-emerald-200">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                Student Learning Hub
              </Badge>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#1A3A1A] md:text-3xl">
              Welcome back, {studentName}!
            </h1>
            <p className="text-sm text-zinc-600">
              Track your enrolled courses, plan study routines, track daily goals, and stay focused.
            </p>
          </div>
        </div>

        {/* Right Stats Quick Pill Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold leading-none text-[#1A3A1A]">
                {enrollmentsCount}
              </div>
              <div className="text-xs font-semibold text-zinc-500">Enrolled Courses</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-2.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold leading-none text-green-800">
                {approvedCount}
              </div>
              <div className="text-xs font-semibold text-green-700/80">Active & Learning</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
