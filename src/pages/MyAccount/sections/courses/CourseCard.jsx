import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  User,
  Calendar,
  Laptop,
  Rocket,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  HelpCircle,
  FolderOpen,
} from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'

export default function CourseCard({ enrollment }) {
  const navigate = useNavigate()
  const course = enrollment.course || {}
  const status = enrollment.status || 'pending'

  const isApproved = status === 'approved'
  const isPending = status === 'pending'
  const isRejected = status === 'rejected'

  return (
    <Card className="flex flex-col justify-between transition-all hover:border-emerald-300 hover:shadow-lg dark:hover:border-emerald-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          {isApproved && (
            <Badge variant="success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Approved
            </Badge>
          )}
          {isPending && (
            <Badge variant="warning">
              <Clock className="h-3.5 w-3.5" /> Pending Verification
            </Badge>
          )}
          {isRejected && (
            <Badge variant="danger">
              <XCircle className="h-3.5 w-3.5" /> Rejected
            </Badge>
          )}

          {course.price && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {course.price}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug text-zinc-900 line-clamp-2 dark:text-zinc-100">
          {course.title}
        </h3>

        {course.teacher?.name && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <User className="h-3.5 w-3.5 text-emerald-600" />
            <span>{course.teacher.name}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-2 pb-4 text-xs text-zinc-600 dark:text-zinc-400">
        {course.schedule && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span className="line-clamp-1">{course.schedule}</span>
          </div>
        )}
        {course.mode && (
          <div className="flex items-center gap-2">
            <Laptop className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span>{course.mode}</span>
          </div>
        )}
        {course.startDate && (
          <div className="flex items-center gap-2">
            <Rocket className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span>Starts: {course.startDate}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        {isApproved ? (
          <>
            <Button
              className="w-full font-bold"
              onClick={() => navigate(`/my-courses/${course.id}/overview`)}
            >
              <BookOpen className="h-4 w-4" /> Open Course Portal
            </Button>

            <div className="grid w-full grid-cols-3 gap-1.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/my-courses/${course.id}/materials`)}
                className="h-8 text-[11px] px-1 text-zinc-600 dark:text-zinc-300"
                title="Course Materials"
              >
                <FolderOpen className="h-3 w-3" /> Materials
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/my-courses/${course.id}/daily-questions`)}
                className="h-8 text-[11px] px-1 text-zinc-600 dark:text-zinc-300"
                title="Daily Questions"
              >
                <HelpCircle className="h-3 w-3" /> Questions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/my-courses/${course.id}/past-papers`)}
                className="h-8 text-[11px] px-1 text-zinc-600 dark:text-zinc-300"
                title="Past Papers"
              >
                <FileText className="h-3 w-3" /> Papers
              </Button>
            </div>
          </>
        ) : isPending ? (
          <div className="flex w-full items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Your enrollment is awaiting confirmation by admin. Access will be unlocked upon approval.</span>
          </div>
        ) : (
          <div className="flex w-full items-start gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/70 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Enrollment was rejected. Please contact support via WhatsApp if you need help.</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
