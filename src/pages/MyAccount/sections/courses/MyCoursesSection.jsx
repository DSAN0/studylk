import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, SearchX } from 'lucide-react'
import CourseCard from './CourseCard'
import CourseFilters from './CourseFilters'
import { Card } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'

export default function MyCoursesSection({
  enrollments = [],
  approvedCourses = [],
  pendingCourses = [],
}) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => {
      const matchesFilter = courseFilter === 'all' || e.status === courseFilter
      const courseTitle = e.course?.title?.toLowerCase() || ''
      const teacherName = e.course?.teacher?.name?.toLowerCase() || ''
      const matchesSearch =
        courseTitle.includes(searchQuery.toLowerCase()) ||
        teacherName.includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [enrollments, courseFilter, searchQuery])

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <CourseFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        allCount={enrollments.length}
        approvedCount={approvedCourses.length}
        pendingCount={pendingCourses.length}
      />

      {/* Courses Grid or Empty State */}
      {filteredEnrollments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            {enrollments.length === 0 ? (
              <BookOpen className="h-8 w-8" />
            ) : (
              <SearchX className="h-8 w-8" />
            )}
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            {enrollments.length === 0
              ? "You haven't enrolled in any courses yet"
              : 'No matching courses found'}
          </h3>
          <p className="mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            {enrollments.length === 0
              ? 'Browse our top-rated Sri Lankan A/L and O/L courses and enroll with your student account.'
              : 'Try searching with a different keyword or resetting your filter criteria.'}
          </p>

          {enrollments.length === 0 ? (
            <Button onClick={() => navigate('/streams')} className="font-bold">
              📚 Browse Course Catalog
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setCourseFilter('all')
              }}
            >
              Reset Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments.map(item => (
            <CourseCard key={item.id} enrollment={item} />
          ))}
        </div>
      )}
    </div>
  )
}
