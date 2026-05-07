import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminGetApprovedStudents } from '../../api/api'

export default function AdminApprovedStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminGetApprovedStudents()
        setStudents(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-[90px] px-6">
        <p className="text-muted text-center">Loading approved students...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-[90px] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-display font-bold text-3xl">Approved Students</h1>
            <p className="text-muted text-sm mt-2">
              Students approved for course access.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-surface2 border border-white/10 rounded-xl px-4 py-2 text-sm text-muted"
          >
            Back Dashboard
          </button>
        </div>

        <div className="bg-surface border border-white/[0.08] rounded-2xl p-6">
          {students.length === 0 ? (
            <p className="text-muted text-sm">No approved students yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-white/[0.08]">
                    <th className="py-3 pr-4">Student</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4">Course</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map(item => (
                    <tr key={item.id} className="border-b border-white/[0.05]">
                      <td className="py-4 pr-4 text-white">
                        {item.student?.first_name} {item.student?.last_name}
                      </td>
                      <td className="py-4 pr-4 text-muted">{item.student?.email}</td>
                      <td className="py-4 pr-4 text-muted">{item.student?.phone}</td>
                      <td className="py-4 pr-4 text-muted">{item.course?.title}</td>
                      <td className="py-4 pr-4">
                        <span className="bg-commerce/10 text-commerce border border-commerce/25 rounded-full px-3 py-1 text-xs">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}