import React from 'react'
import { Calendar, Timer, StickyNote, Play, ArrowRight, BookOpen } from 'lucide-react'
import MetricCards from './MetricCards'
import QuickCoursesWidget from './QuickCoursesWidget'
import ShortcutsGrid from './ShortcutsGrid'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'

export default function DashboardSection({
  studentName = 'Student',
  enrollments = [],
  approvedCourses = [],
  pendingCourses = [],
  onGoToTab,
}) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-900 p-6 text-white shadow-lg md:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Calendar className="h-3.5 w-3.5" />
              <span>{today}</span>
            </div>
            <h2 className="text-2xl font-black md:text-3xl">
              Ready to continue your study journey?
            </h2>
            <p className="max-w-xl text-sm text-emerald-100/90">
              You currently have <span className="font-bold underline">{approvedCourses.length} active courses</span> with theory guides, practice questions, and past papers ready for you.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={() => onGoToTab('courses')}
                className="bg-white text-emerald-900 hover:bg-emerald-50 hover:text-emerald-950 font-bold"
              >
                <BookOpen className="h-4 w-4" /> Go to My Courses
              </Button>
              <Button
                variant="outline"
                onClick={() => onGoToTab('focus')}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Timer className="h-4 w-4" /> Start Focus Session
              </Button>
            </div>
          </div>

          <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl shadow-inner md:flex">
            🎓
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricCards
        enrollmentsCount={enrollments.length}
        approvedCount={approvedCourses.length}
        pendingCount={pendingCourses.length}
        onGoToTab={onGoToTab}
      />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left (2 cols): My Courses quick view */}
        <div className="lg:col-span-2">
          <QuickCoursesWidget
            enrollments={enrollments}
            onGoToCourses={() => onGoToTab('courses')}
          />
        </div>

        {/* Right (1 col): Mini Focus & Mini Notes widgets */}
        <div className="flex flex-col gap-6">
          {/* Mini Focus Widget */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base">Focus Zone (Pomodoro)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-500">
                25 minutes of deep, distraction-free study intervals with structured breaks.
              </p>
              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                <span className="text-2xl font-black text-emerald-800">
                  25:00
                </span>
                <Button size="sm" onClick={() => onGoToTab('focus')} className="gap-1 text-xs font-bold">
                  <Play className="h-3 w-3" /> Launch Timer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mini Scratchpad Widget */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base">Study Scratchpad</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-500">
                Quickly save formula summaries, important theorem reminders, and exam checklists.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onGoToTab('notes')}
                className="w-full text-xs font-bold"
              >
                Open Study Notes <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shortcuts */}
      <ShortcutsGrid />
    </div>
  )
}
