import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, User, Laptop, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'

export default function QuickCoursesWidget({ enrollments = [], onGoToCourses }) {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          <CardTitle>My Courses</CardTitle>
        </div>
        <button
          onClick={onGoToCourses}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
        >
          View All ({enrollments.length}) <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="flex-1">
        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <BookOpen className="h-7 w-7" />
            </div>
            <h4 className="text-base font-bold text-[#1A3A1A]">No Enrolled Courses Yet</h4>
            <p className="mb-4 max-w-xs text-xs text-zinc-500">
              Explore our wide collection of A/L and O/L courses and enroll today to start learning!
            </p>
            <Button size="sm" onClick={() => navigate('/streams')}>
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.slice(0, 3).map(item => {
              const course = item.course || {}
              const isApproved = item.status === 'approved'
              const isPending = item.status === 'pending'

              return (
                <div
                  key={item.id}
                  className="group flex flex-col gap-3 rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3.5 transition-all duration-150 hover:border-emerald-200 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-800">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        {isApproved && (
                          <Badge variant="success" className="text-[10px] py-0">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="warning" className="text-[10px] py-0">
                            <Clock className="h-3 w-3" /> Pending
                          </Badge>
                        )}
                        {!isApproved && !isPending && (
                          <Badge variant="danger" className="text-[10px] py-0">
                            <XCircle className="h-3 w-3" /> Rejected
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#1A3A1A] line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="flex items-center gap-3 text-xs text-zinc-500">
                        {course.teacher?.name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {course.teacher.name}
                          </span>
                        )}
                        {course.mode && (
                          <span className="flex items-center gap-1">
                            <Laptop className="h-3 w-3" /> {course.mode}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {isApproved ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/my-courses/${course.id}/overview`)}
                        className="text-xs font-bold"
                      >
                        Open Portal →
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">
                        {isPending ? 'Verification in progress' : 'Enrollment rejected'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
