import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { studentMyCourses, studentProfile } from '../../api/api'

import AccountHeader from './components/AccountHeader'
import AccountNav from './components/AccountNav'
import DashboardSection from './sections/dashboard/DashboardSection'
import MyCoursesSection from './sections/courses/MyCoursesSection'
import CalendarSection from './sections/calendar/CalendarSection'
import FocusSection from './sections/focus/FocusSection'
import GoalsSection from './sections/goals/GoalsSection'
import NotesSection from './sections/notes/NotesSection'
import ProfileSection from './sections/profile/ProfileSection'

function BaseStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .ma-sidebar    { display: block; }
      .ma-mobile-nav { display: none !important; }
      @media (max-width: 1024px) {
        .ma-sidebar    { display: none !important; }
        .ma-mobile-nav { display: flex !important; }
      }
    `}</style>
  )
}

export default function MyAccount({ defaultTab }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = defaultTab || searchParams.get('tab') || 'dashboard'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [student, setStudent] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && tabFromUrl !== activeTab) setActiveTab(tabFromUrl)
  }, [searchParams])

  const handleTabChange = tabId => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('studentUser')
    const token = localStorage.getItem('studentAccessToken')

    if (!savedUser && !token) { navigate('/login'); return }
    if (savedUser) {
      try { setStudent(JSON.parse(savedUser)) } catch { /* ignore */ }
    }

    async function loadAccountData() {
      try {
        const [profileRes, coursesRes] = await Promise.allSettled([
          studentProfile(),
          studentMyCourses(),
        ])
        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          setStudent(profileRes.value.data)
          localStorage.setItem('studentUser', JSON.stringify(profileRes.value.data))
        }
        if (coursesRes.status === 'fulfilled' && coursesRes.value?.data) {
          setEnrollments(coursesRes.value.data || [])
        } else if (
          coursesRes.status === 'rejected' &&
          coursesRes.reason?.response?.status === 401
        ) {
          navigate('/login'); return
        }
      } catch (err) {
        console.error('Failed to load account data', err)
      } finally {
        setLoading(false)
      }
    }
    loadAccountData()
  }, [navigate])

  const approvedCourses = useMemo(() => enrollments.filter(e => e.status === 'approved'), [enrollments])
  const pendingCourses  = useMemo(() => enrollments.filter(e => e.status === 'pending'),  [enrollments])

  const handleLogout = () => {
    localStorage.removeItem('studentAccessToken')
    localStorage.removeItem('studentRefreshToken')
    localStorage.removeItem('studentUser')
    navigate('/login')
  }

  if (loading && !student) {
    return (
      <>
        <BaseStyles />
        <main style={{
          minHeight: '100vh', paddingTop: 90,
          background: 'linear-gradient(160deg, #F0FAF0 0%, #FAFFFE 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 14,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <div style={{ fontSize: '2.2rem' }}>🎓</div>
          <p style={{ color: '#5A7A5A', fontWeight: 600, fontSize: '0.95rem' }}>Loading your learning hub…</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4CAF50',
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </main>
      </>
    )
  }

  const studentName = student?.first_name
    ? `${student.first_name} ${student.last_name || ''}`.trim()
    : student?.full_name || student?.name || student?.username || 'Student'
  const studentEmail = student?.email || 'student@studylk.com'

  return (
    <>
      <BaseStyles />
      <div style={{
        minHeight: '100vh', background: '#F8FBF8', paddingTop: 68,
        fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A3A1A',
      }}>
        <AccountHeader
          studentName={studentName}
          enrollmentsCount={enrollments.length}
          approvedCount={approvedCourses.length}
        />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>

          {/* Mobile horizontal nav */}
          <div
            className="ma-mobile-nav"
            style={{
              display: 'none', overflowX: 'auto', gap: 8,
              paddingBottom: 16, marginBottom: 24,
              borderBottom: '1.5px solid #E8F5E9',
              scrollbarWidth: 'none',
            }}
          >
            <AccountNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              enrollmentsCount={enrollments.length}
              mobile
            />
          </div>

          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            {/* Desktop sticky sidebar */}
            <div className="ma-sidebar" style={{ width: 264, minWidth: 264, flexShrink: 0 }}>
              <AccountNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
                enrollmentsCount={enrollments.length}
                studentName={studentName}
                studentEmail={studentEmail}
                onLogout={handleLogout}
              />
            </div>

            {/* Main content panel */}
            <main style={{ flex: 1, minWidth: 0 }}>
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
              {activeTab === 'focus'    && <FocusSection />}
              {activeTab === 'goals'    && <GoalsSection />}
              {activeTab === 'notes'    && <NotesSection />}
              {activeTab === 'profile'  && (
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
    </>
  )
}