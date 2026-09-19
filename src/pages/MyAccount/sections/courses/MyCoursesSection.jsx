import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from './CourseCard'
import CourseFilters from './CourseFilters'

export default function MyCoursesSection({ enrollments = [], approvedCourses = [], pendingCourses = [] }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => {
      const matchesFilter = courseFilter === 'all' || e.status === courseFilter
      const courseTitle  = e.course?.title?.toLowerCase() || ''
      const teacherName  = e.course?.teacher?.name?.toLowerCase() || ''
      const matchesSearch =
        courseTitle.includes(searchQuery.toLowerCase()) ||
        teacherName.includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [enrollments, courseFilter, searchQuery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filters bar */}
      <CourseFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        allCount={enrollments.length}
        approvedCount={approvedCourses.length}
        pendingCount={pendingCourses.length}
      />

      {/* Grid or empty state */}
      {filteredEnrollments.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '56px 32px',
          background: 'white', borderRadius: 22,
          border: '1.5px solid #E8F5E9',
          boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>
            {enrollments.length === 0 ? '📭' : '🔍'}
          </div>
          <h3 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: '1.3rem', color: '#1A3A1A', marginBottom: 8,
          }}>
            {enrollments.length === 0
              ? "You haven't enrolled in any courses yet"
              : 'No matching courses found'}
          </h3>
          <p style={{
            color: '#7A9A7A', fontSize: '0.9rem', marginBottom: 24,
            maxWidth: 380, lineHeight: 1.6,
          }}>
            {enrollments.length === 0
              ? 'Browse our top-rated Sri Lankan A/L and O/L courses and enroll with your student account.'
              : 'Try searching with a different keyword or resetting your filters.'}
          </p>

          {enrollments.length === 0 ? (
            <button
              onClick={() => navigate('/streams')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '10px 24px', fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 3px 12px rgba(76,175,80,0.28)',
              }}
            >
              📚 Browse Course Catalog
            </button>
          ) : (
            <button
              onClick={() => { setSearchQuery(''); setCourseFilter('all') }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'white', border: '1.5px solid #C8E6C9',
                color: '#3A5A3A', borderRadius: 50,
                padding: '10px 24px', fontSize: '0.87rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: 18,
        }}>
          {filteredEnrollments.map(item => (
            <CourseCard key={item.id} enrollment={item} />
          ))}
        </div>
      )}
    </div>
  )
}