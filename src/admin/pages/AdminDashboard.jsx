import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminApproveEnrollment,
  adminGetCourses,
  adminGetEnrollments,
  adminGetRegistrations,
  adminRejectEnrollment,
} from '../../api/api'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const coursesRes = await adminGetCourses()
      const registrationsRes = await adminGetRegistrations()
      const enrollmentsRes = await adminGetEnrollments()

      setCourses(coursesRes.data)
      setRegistrations(registrationsRes.data)
      setEnrollments(enrollmentsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  async function approve(id) {
    try {
      await adminApproveEnrollment(id)
      await loadData()
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Approve failed'))
    }
  }

  async function reject(id) {
    const reason = prompt('Reject reason?') || ''

    try {
      await adminRejectEnrollment(id, { admin_note: reason })
      await loadData()
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Reject failed'))
    }
  }

  const pending = enrollments.filter(e => e.status === 'pending')
  const approved = enrollments.filter(e => e.status === 'approved')
  const rejected = enrollments.filter(e => e.status === 'rejected')

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-[90px] px-6">
        <p className="text-muted text-center">Loading admin dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-[68px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className="section-label">StudyLK</p>
            <h1 className="font-display font-bold text-3xl">Admin Dashboard</h1>
          </div>

          <button
            onClick={logout}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => navigate('/admin/courses/new')}
            className="btn-primary text-sm"
          >
            + Add Course
          </button>

          <button
            onClick={() => navigate('/admin/materials')}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted hover:text-white"
          >
            Course Materials
          </button>

          <button
            onClick={() => navigate('/admin/approved-students')}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted hover:text-white"
          >
            Approved Students
          </button>

          <button
            onClick={() => navigate('/admin/daily-questions')}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted hover:text-white"
          >
            Daily Questions
          </button>

          <button
            onClick={() => navigate('/admin/question-papers')}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted hover:text-white"
          >
            Question Papers
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-10">
          <Stat title="Courses" value={courses.length} />
          <Stat title="Old Registrations" value={registrations.length} />
          <Stat title="Enrollments" value={enrollments.length} />
          <Stat title="Pending" value={pending.length} />
          <Stat title="Approved" value={approved.length} />
          <Stat title="Rejected" value={rejected.length} />
        </div>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-lg">Courses</h2>

            <button
              onClick={() => navigate('/admin/courses/new')}
              className="btn-primary text-sm"
            >
              + Add course
            </button>
          </div>

          {courses.length === 0 ? (
            <p className="text-muted text-sm">No courses added yet.</p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 10).map(c => (
                <div
                  key={c.id}
                  className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-sm">{c.title}</h3>

                    <p className="text-muted text-xs">
                      {c.teacher_name || c.teacher?.name || 'Teacher'} · {c.price}
                    </p>

                    <p className="text-muted text-xs">
                      Seats left: {c.seats_left}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/courses/${c.id}`)}
                    className="text-accent text-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-5">Pending Enrollments</h2>

          {pending.length === 0 ? (
            <p className="text-muted text-sm">No pending enrollments.</p>
          ) : (
            <div className="space-y-3">
              {pending.map(e => (
                <div
                  key={e.id}
                  className="bg-surface2 border border-white/[0.07] rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {e.student?.first_name} {e.student?.last_name}
                      </h3>

                      <p className="text-muted text-xs">
                        {e.student?.email} · {e.student?.phone}
                      </p>

                      <p className="text-muted text-xs mt-1">
                        Course: {e.course?.title}
                      </p>

                      {e.payment_note && (
                        <p className="text-muted text-xs mt-1">
                          Note: {e.payment_note}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(e.id)}
                        className="bg-commerce/10 border border-commerce/30 text-commerce rounded-xl px-4 py-2 text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(e.id)}
                        className="bg-arts/10 border border-arts/30 text-arts rounded-xl px-4 py-2 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-5">Recent Enrollments</h2>

          {enrollments.length === 0 ? (
            <p className="text-muted text-sm">No enrollments yet.</p>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 10).map(e => (
                <div
                  key={e.id}
                  className="bg-surface2 border border-white/[0.07] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-sm">
                      {e.student?.first_name} {e.student?.last_name}
                    </h3>

                    <p className="text-muted text-xs">
                      {e.student?.email} · {e.course?.title}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${getStatusClass(
                      e.status
                    )}`}
                  >
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Stat({ title, value }) {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-2xl p-5">
      <p className="text-muted text-sm mb-2">{title}</p>
      <p className="font-display font-bold text-3xl text-accent">{value}</p>
    </div>
  )
}

function getStatusClass(status) {
  if (status === 'approved') {
    return 'bg-commerce/10 text-commerce border-commerce/25'
  }

  if (status === 'rejected') {
    return 'bg-arts/10 text-arts border-arts/25'
  }

  return 'bg-accent/10 text-accent border-accent/25'
}