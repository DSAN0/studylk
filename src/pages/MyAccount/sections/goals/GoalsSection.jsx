import React, { useState, useEffect } from 'react'
import { Target, Plus, Trash2, CheckCircle2, ListTodo } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { Progress } from '../../../../components/ui/progress'
import { cn } from '../../../../lib/utils'

export default function GoalsSection() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('studylk_goals')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            text: 'Complete Physics Mechanics past paper MCQ practice',
            category: 'Physics',
            done: true,
          },
          {
            id: '2',
            text: 'Practice 2022 Combined Mathematics structured problems',
            category: 'Maths',
            done: false,
          },
          {
            id: '3',
            text: 'Review Chemistry Organic Reaction Notes & Reagents',
            category: 'Chemistry',
            done: false,
          },
          {
            id: '4',
            text: 'Solve 20 Daily Questions',
            category: 'Daily Practice',
            done: false,
          },
        ]
  })

  const [newGoalText, setNewGoalText] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState('Physics')

  useEffect(() => {
    localStorage.setItem('studylk_goals', JSON.stringify(goals))
  }, [goals])

  const handleToggle = id => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, done: !g.done } : g)))
  }

  const handleDelete = id => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const handleAddGoal = e => {
    e.preventDefault()
    if (!newGoalText.trim()) return
    const newG = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      category: newGoalCategory,
      done: false,
    }
    setGoals(prev => [newG, ...prev])
    setNewGoalText('')
  }

  const completedCount = goals.filter(g => g.done).length
  const percentDone = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header & Progress Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <CardTitle>🎯 Goals & Study Milestones</CardTitle>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Set daily targets, track revision milestones, and monitor your exam preparation consistency.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-600 dark:text-zinc-400">
                {completedCount} of {goals.length} targets completed
              </span>
              <span className="text-emerald-700 dark:text-emerald-300">
                {percentDone}% Achieved
              </span>
            </div>
            <Progress value={percentDone} className="h-3" />
          </div>

          {/* Add Goal Form */}
          <form onSubmit={handleAddGoal} className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="Add new study goal or target..."
              value={newGoalText}
              onChange={e => setNewGoalText(e.target.value)}
              className="flex-1"
              required
            />

            <select
              value={newGoalCategory}
              onChange={e => setNewGoalCategory(e.target.value)}
              className="flex h-10 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-900 outline-none focus:border-emerald-500"
            >
              <option value="Physics">Physics</option>
              <option value="Maths">Maths</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Daily Practice">Daily Practice</option>
              <option value="Revision">Revision</option>
            </select>

            <Button type="submit" className="font-bold">
              <Plus className="h-4 w-4" /> Add Goal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Goals Checklist Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base">Your Active Targets</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {goals.length === 0 ? (
            <p className="py-8 text-center text-xs text-zinc-400">No active goals. Add your first goal above!</p>
          ) : (
            <div className="space-y-2.5">
              {goals.map(goal => (
                <div
                  key={goal.id}
                  className={cn(
                    'flex items-center justify-between rounded-xl border p-3.5 transition-all',
                    goal.done
                      ? 'border-zinc-100 bg-[#FAFDF9] opacity-60'
                      : 'border-zinc-100 bg-white hover:border-emerald-200 shadow-sm'
                  )}
                >
                  <label className="flex flex-1 items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={goal.done}
                      onChange={() => handleToggle(goal.id)}
                      className="h-4 w-4 rounded border-zinc-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'text-sm font-semibold text-[#1A3A1A]',
                          goal.done && 'line-through text-zinc-400'
                        )}
                      >
                        {goal.text}
                      </span>
                      <Badge variant="default" className="text-[10px] py-0">
                        {goal.category}
                      </Badge>
                    </div>
                  </label>

                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
