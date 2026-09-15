import React from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Timer,
  Target,
  StickyNote,
  User,
  LogOut,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { cn } from '../../../lib/utils'

export const ACCOUNT_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses',   label: 'My Courses', icon: GraduationCap },
  { id: 'calendar',  label: 'Calendar & Schedule', icon: Calendar },
  { id: 'focus',     label: 'Focus Zone', icon: Timer },
  { id: 'goals',     label: 'Goals & Targets', icon: Target },
  { id: 'notes',     label: 'Study Notes', icon: StickyNote },
  { id: 'profile',   label: 'Profile & Settings', icon: User },
]

export default function AccountNav({
  activeTab,
  onTabChange,
  enrollmentsCount = 0,
  studentName = 'Student',
  studentEmail = '',
  onLogout,
}) {
  const initial = studentName ? studentName.charAt(0).toUpperCase() : 'S'

  return (
    <>
      {/* ── Desktop Side Navigation Panel (Sticky Sidebar) ── */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 space-y-4">
          {/* Student Profile Card inside Sidebar */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-xl font-black text-white shadow-md shadow-emerald-700/20">
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Sparkles className="h-3 w-3" />
                  <span>Student Portal</span>
                </div>
                <h3 className="truncate text-sm font-black text-[#1A3A1A]">
                  {studentName}
                </h3>
                <p className="truncate text-xs text-zinc-400">
                  {studentEmail || 'student@studylk.com'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 px-3 py-2 text-xs font-bold text-emerald-900 border border-emerald-100">
              <span>Enrolled Courses</span>
              <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs text-white">
                {enrollmentsCount}
              </span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Navigation Menu
            </div>

            {ACCOUNT_TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-bold transition-all duration-150 cursor-pointer text-left',
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'text-zinc-600 hover:bg-emerald-50 hover:text-emerald-800'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-transform group-hover:scale-110',
                        isActive ? 'text-white' : 'text-emerald-700'
                      )}
                    />
                    <span>{tab.label}</span>
                  </div>

                  {tab.id === 'courses' && enrollmentsCount > 0 && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-black',
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      )}
                    >
                      {enrollmentsCount}
                    </span>
                  )}
                </button>
              )
            })}

            <div className="pt-2 border-t border-zinc-100 my-1" />

            {/* Logout button in sidebar */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Mobile Horizontal Navigation Bar ── */}
      <nav className="lg:hidden no-scrollbar mb-6 flex gap-2 overflow-x-auto border-b border-emerald-100 pb-2">
        {ACCOUNT_TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'courses' && enrollmentsCount > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-black',
                    isActive ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                  )}
                >
                  {enrollmentsCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
