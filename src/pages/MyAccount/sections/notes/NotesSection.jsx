import React, { useState, useEffect } from 'react'
import { StickyNote, Search, Plus, Trash2, X, Save } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../lib/utils'

export default function NotesSection() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('studylk_notes')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            title: 'Newtonian Mechanics Formulas',
            content:
              'F = ma\nv = u + at\ns = ut + 0.5at^2\nv^2 = u^2 + 2as\nConservation of Linear Momentum: m1u1 + m2u2 = m1v1 + m2v2',
            color: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-200',
            tag: 'Physics',
            updatedAt: 'Today',
          },
          {
            id: '2',
            title: 'Important Organic Chemistry Reagents',
            content:
              '1. PCl5 / SOCl2: converts OH to Cl\n2. KMnO4 / H+: strong oxidizing agent\n3. LiAlH4: reduction of acids and esters to primary alcohols',
            color: 'bg-amber-50/90 border-amber-200/80 text-amber-950 dark:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-200',
            tag: 'Chemistry',
            updatedAt: 'Yesterday',
          },
        ]
  })

  const [search, setSearch] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newTag, setNewTag] = useState('Physics')
  const [newColorKey, setNewColorKey] = useState('emerald')
  const [isCreating, setIsCreating] = useState(false)

  const COLOR_MAP = {
    emerald: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-200',
    amber: 'bg-amber-50/90 border-amber-200/80 text-amber-950 dark:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-200',
    sky: 'bg-sky-50/90 border-sky-200/80 text-sky-950 dark:bg-sky-950/40 dark:border-sky-900/40 dark:text-sky-200',
    purple: 'bg-purple-50/90 border-purple-200/80 text-purple-950 dark:bg-purple-950/40 dark:border-purple-900/40 dark:text-purple-200',
  }

  useEffect(() => {
    localStorage.setItem('studylk_notes', JSON.stringify(notes))
  }, [notes])

  const handleCreateNote = e => {
    e.preventDefault()
    if (!newTitle.trim() && !newContent.trim()) return
    const newN = {
      id: Date.now().toString(),
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      tag: newTag,
      color: COLOR_MAP[newColorKey] || COLOR_MAP.emerald,
      updatedAt: 'Just now',
    }
    setNotes(prev => [newN, ...prev])
    setNewTitle('')
    setNewContent('')
    setIsCreating(false)
  }

  const handleDeleteNote = id => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotes = notes.filter(
    n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tag.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search study notes or formulas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button onClick={() => setIsCreating(!isCreating)} className="gap-1.5 font-bold">
          {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isCreating ? 'Cancel' : 'Create New Note'}
        </Button>
      </div>

      {/* Creation Modal Card */}
      {isCreating && (
        <Card className="border-emerald-300 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📝 New Quick Study Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <Input
                type="text"
                placeholder="Note title (e.g. Waves & Doppler Effect Summary)..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Write equations, key bullet points, or revision tips..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={4}
                className="flex w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-[#1A3A1A] outline-none focus:border-emerald-500 focus:bg-white"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  <span>Color:</span>
                  {['emerald', 'amber', 'sky', 'purple'].map(col => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setNewColorKey(col)}
                      className={cn(
                        'h-5 w-5 rounded-full border cursor-pointer',
                        col === 'emerald' && 'bg-emerald-300',
                        col === 'amber' && 'bg-amber-300',
                        col === 'sky' && 'bg-sky-300',
                        col === 'purple' && 'bg-purple-300',
                        newColorKey === col && 'ring-2 ring-emerald-600 ring-offset-2'
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    className="flex h-9 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-900 outline-none focus:border-emerald-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Maths">Maths</option>
                    <option value="Biology">Biology</option>
                    <option value="General">General</option>
                  </select>

                  <Button type="submit" size="sm" className="font-bold">
                    <Save className="h-3.5 w-3.5" /> Save Note
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
            <StickyNote className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-[#1A3A1A]">No study notes found</h3>
          <p className="mb-4 text-xs text-zinc-500">
            Create formula sheets, memory shortcuts, or exam reminders.
          </p>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            Create First Note
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                note.color
              )}
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="default" className="text-[10px] bg-white/70 py-0">
                    {note.tag}
                  </Badge>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-zinc-400 hover:text-rose-600 cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="mb-2 text-sm font-bold text-[#1A3A1A]">{note.title}</h4>
                <p className="whitespace-pre-wrap text-xs leading-relaxed opacity-90">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 border-t border-black/5 pt-2 text-[10px] opacity-70">
                Updated: {note.updatedAt}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
