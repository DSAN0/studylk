import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { studentMyCourses, studentProfile } from '../../api/api'

// Navigation & Header Components
import AccountHeader from './components/AccountHeader'
import AccountNav from './components/AccountNav'

// Modular Section Folders
import DashboardSection from './sections/dashboard/DashboardSection'
import MyCoursesSection from './sections/courses/MyCoursesSection'
import CalendarSection from './sections/calendar/CalendarSection'
import FocusSection from './sections/focus/FocusSection'
import GoalsSection from './sections/goals/GoalsSection'
import NotesSection from './sections/notes/NotesSection'
import ProfileSection from './sections/profile/ProfileSection'

export default function MyAccount({ defaultTab }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = defaultTab || searchParams.get('tab') || 'dashboard'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [student, setStudent] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  // URL query sync
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleTabChange = tabId => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // Load user & enrollment data directly from the database
  useEffect(() => {
    const savedUser = localStorage.getItem('studentUser')
    const token = localStorage.getItem('studentAccessToken')

    if (!savedUser && !token) {
      navigate('/login')
      return
    }

    if (savedUser) {
      try {
        setStudent(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse studentUser', e)
      }
    }

    async function loadAccountData() {
      try {
        const [profileRes, coursesRes] = await Promise.allSettled([
          studentProfile(),
          studentMyCourses(),
        ])

        // Live Profile Data from DB
        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          setStudent(profileRes.value.data)
          localStorage.setItem('studentUser', JSON.stringify(profileRes.value.data))
        }

        // Live Courses Data from DB
        if (coursesRes.status === 'fulfilled' && coursesRes.value?.data) {
          setEnrollments(coursesRes.value.data || [])
        } else if (
          coursesRes.status === 'rejected' &&
          coursesRes.reason?.response?.status === 401
        ) {
          navigate('/login')
          return
        }
      } catch (err) {
        console.error('Failed to load account data from database', err)
      } finally {
        setLoading(false)
      }
    }

    loadAccountData()
  }, [navigate])

  const approvedCourses = useMemo(
    () => enrollments.filter(e => e.status === 'approved'),
    [enrollments]
  )
  const pendingCourses = useMemo(
    () => enrollments.filter(e => e.status === 'pending'),
    [enrollments]
  )

  const handleLogout = () => {
    localStorage.removeItem('studentAccessToken')
    localStorage.removeItem('studentRefreshToken')
    localStorage.removeItem('studentUser')
    navigate('/login')
  }

  if (loading && !student) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F8FBF8] pt-20 text-[#1A3A1A]">
        <div className="text-4xl animate-bounce">🎓</div>
        <p className="text-sm font-bold text-emerald-800">
          Loading your learning hub…
        </p>
      </main>
    )
  }

  const studentName = student?.first_name
    ? `${student.first_name} ${student.last_name || ''}`.trim()
    : student?.full_name || student?.name || student?.username || 'Student'
  const studentEmail = student?.email || 'student@studylk.com'

  return (
    <div className="min-h-screen bg-[#F8FBF8] pt-16 font-sans text-[#1A3A1A]">
      {/* Top Header Hero */}
      <AccountHeader
        studentName={studentName}
        enrollmentsCount={enrollments.length}
        approvedCount={approvedCourses.length}
      />

      {/* Main Container with Side Navigation Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Side Navigation Panel */}
          <AccountNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            enrollmentsCount={enrollments.length}
            studentName={studentName}
            studentEmail={studentEmail}
            onLogout={handleLogout}
          />

          {/* Right Main Content Panel */}
          <main className="flex-1 w-full min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardSection
                studentName={studentName}
                enrollments={enrollments}
                approvedCourses={approvedCourses}
                pendingCourses={pendingCourses}
                onGoToTab={handleTabChange}
              />
            )}

            {activeTab === 'courses' && (
              <MyCoursesSection
                enrollments={enrollments}
                approvedCourses={approvedCourses}
                pendingCourses={pendingCourses}
              />
            )}

            {activeTab === 'calendar' && <CalendarSection />}

            {activeTab === 'focus' && <FocusSection />}

            {activeTab === 'goals' && <GoalsSection />}

            {activeTab === 'notes' && <NotesSection />}

            {activeTab === 'profile' && (
              <ProfileSection
                student={student}
                studentName={studentName}
                studentEmail={studentEmail}
                enrollmentsCount={enrollments.length}
                approvedCount={approvedCourses.length}
                onLogout={handleLogout}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
