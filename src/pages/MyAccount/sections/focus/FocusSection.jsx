import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Flame,
  Target,
  Sparkles,
  Timer,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../lib/utils'

const PRESETS = [
  { label: '25m Focus (Pomodoro)', duration: 25 * 60, type: 'focus' },
  { label: '50m Deep Work', duration: 50 * 60, type: 'deep' },
  { label: '5m Quick Break', duration: 5 * 60, type: 'break' },
  { label: '15m Long Break', duration: 15 * 60, type: 'longBreak' },
]

export default function FocusSection() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0])
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].duration)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(() => {
    return parseInt(localStorage.getItem('studylk_focus_sessions') || '0', 10)
  })
  const [ambientSound, setAmbientSound] = useState(false)

  const timerRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsRunning(false)
            if (selectedPreset.type === 'focus' || selectedPreset.type === 'deep') {
              setCompletedSessions(s => {
                const updated = s + 1
                localStorage.setItem('studylk_focus_sessions', updated.toString())
                return updated
              })
            }
            alert(`🎉 Well done! Completed session: ${selectedPreset.label}`)
            return selectedPreset.duration
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning, selectedPreset])

  const handleSelectPreset = preset => {
    setIsRunning(false)
    setSelectedPreset(preset)
    setTimeLeft(preset.duration)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(selectedPreset.duration)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progressPercent = ((selectedPreset.duration - timeLeft) / selectedPreset.duration) * 100

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="flex flex-col items-center p-8 text-center sm:p-10">
        <Badge variant="default" className="mb-3 gap-1.5 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Deep Work & Study Mode</span>
        </Badge>

        <h2 className="text-2xl font-black text-[#1A3A1A] md:text-3xl">
          Focus Zone
        </h2>
        <p className="mb-6 max-w-md text-xs text-zinc-500 md:text-sm">
          Maximize study retention with interval-based focus cycles and organized breaks.
        </p>

        {/* Preset Selector */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer',
                selectedPreset.label === p.label
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Circular Progress Ring Timer */}
        <div className="relative mb-8 flex h-60 w-60 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r="110"
              className="fill-none stroke-emerald-100/60 stroke-[10]"
            />
            <circle
              cx="130"
              cy="130"
              r="110"
              className="fill-none stroke-emerald-600 stroke-[10] transition-all duration-700 ease-linear"
              strokeLinecap="round"
              style={{
                strokeDasharray: 691,
                strokeDashoffset: 691 - (691 * progressPercent) / 100,
              }}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black tracking-tight text-[#1A3A1A]">
              {formattedTime}
            </span>
            <span className="mt-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
              {isRunning ? '🔥 In Progress' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => setIsRunning(!isRunning)}
            className="gap-2 px-8 text-base font-black"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white" /> Start Focus
              </>
            )}
          </Button>

          <Button variant="outline" size="lg" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>

        {/* Footer Metrics */}
        <div className="grid w-full grid-cols-1 gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-base font-black text-[#1A3A1A]">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>{completedSessions}</span>
            </div>
            <span className="text-xs font-semibold text-zinc-400">Completed Sessions</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-base font-black text-[#1A3A1A]">
              <Target className="h-4 w-4 text-emerald-600" />
              <span>
                {(completedSessions * 25) / 60 >= 1
                  ? `${((completedSessions * 25) / 60).toFixed(1)} hrs`
                  : `${completedSessions * 25} mins`}
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-400">Focus Time Logged</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setAmbientSound(!ambientSound)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                ambientSound
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              )}
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>{ambientSound ? 'Ambient: ON' : 'Ambient: OFF'}</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
