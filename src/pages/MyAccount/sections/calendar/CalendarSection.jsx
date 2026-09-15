import React, { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  GraduationCap,
  Award,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'

const TYPE_CONFIG = {
  study: { label: 'Study', icon: BookOpen, badge: 'default' },
  paper: { label: 'Paper Practice', icon: FileText, badge: 'warning' },
  class: { label: 'Live Class', icon: GraduationCap, badge: 'blue' },
  exam:  { label: 'Exam Date', icon: Award, badge: 'danger' },
}

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('studylk_calendar_events')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            title: 'Physics Mechanics Past Paper',
            date: new Date().toISOString().split('T')[0],
            type: 'paper',
          },
          {
            id: '2',
            title: 'Combined Maths Live Revision Session',
            date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            type: 'class',
          },
        ]
  })

  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0])
  const [newEventType, setNewEventType] = useState('study')

  useEffect(() => {
    localStorage.setItem('studylk_calendar_events', JSON.stringify(events))
  }, [events])

  const handleAddEvent = e => {
    e.preventDefault()
    if (!newEventTitle.trim()) return
    const newEv = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      date: newEventDate,
      type: newEventType,
    }
    setEvents(prev => [...prev, newEv])
    setNewEventTitle('')
  }

  const handleDeleteEvent = id => {
    setEvents(prev => prev.filter(ev => ev.id !== id))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  const daysArray = []
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left 2 cols: Month Calendar Grid */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-emerald-600" />
            <CardTitle>
              {monthName} {year}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="h-8 text-xs font-bold"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Weekday headers */}
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-bold text-zinc-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-20 rounded-xl bg-transparent" />
              }

              const curDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isToday = curDayStr === todayStr
              const dayEvents = events.filter(e => e.date === curDayStr)

              return (
                <div
                  key={day}
                  className={`flex h-20 flex-col justify-start rounded-xl border p-1.5 transition-colors ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-zinc-100 bg-[#FAFDF9] hover:bg-emerald-50/30'
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold ${
                      isToday
                        ? 'text-emerald-700'
                        : 'text-zinc-700'
                    }`}
                  >
                    {day}
                  </span>

                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayEvents.map(ev => {
                      const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.study
                      return (
                        <div
                          key={ev.id}
                          title={ev.title}
                          className="truncate rounded px-1 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800"
                        >
                          {ev.title}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Right 1 col: Add Event & Upcoming list */}
      <div className="flex flex-col gap-6">
        {/* Add Event Form Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">➕ Add Study Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <Input
                  type="text"
                  placeholder="Event title (e.g. Organic Chemistry Paper)..."
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  required
                />
                <select
                  value={newEventType}
                  onChange={e => setNewEventType(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 outline-none focus:border-emerald-500"
                >
                  <option value="study">📖 Study</option>
                  <option value="paper">📝 Paper</option>
                  <option value="class">🎓 Live Class</option>
                  <option value="exam">🏆 Exam</option>
                </select>
              </div>

              <Button type="submit" className="w-full font-bold">
                <Plus className="h-4 w-4" /> Add Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Scheduled List Card */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📋 Scheduled Study Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-xs text-zinc-400">No scheduled events. Plan your study routine above!</p>
            ) : (
              <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                {events.map(ev => {
                  const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.study
                  return (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3"
                    >
                      <div className="space-y-1">
                        <Badge variant={cfg.badge} className="text-[10px] py-0">
                          {cfg.label}
                        </Badge>
                        <h4 className="text-xs font-bold text-[#1A3A1A] line-clamp-1">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400">📅 {ev.date}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
