import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Award, BookMarked, Compass, Rocket } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'

export default function ShortcutsGrid() {
  const shortcuts = [
    {
      title: 'Past Papers Hub',
      desc: 'Browse official exam papers and practice MCQs',
      to: '/explore/past-papers',
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Model Papers',
      desc: 'Master structured revision and model questions',
      to: '/explore/model-papers',
      icon: Award,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Study Notes & Sheets',
      desc: 'Concise short notes and formula summaries',
      to: '/explore/notes',
      icon: BookMarked,
      color: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Course Catalog',
      desc: 'Discover top teachers across A/L and O/L streams',
      to: '/streams',
      icon: Compass,
      color: 'bg-purple-50 text-purple-700',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-emerald-600" />
          <CardTitle>Quick Study Shortcuts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                to={item.to}
                className="group flex items-center gap-3.5 rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-sm"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A3A1A] group-hover:text-emerald-700">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
