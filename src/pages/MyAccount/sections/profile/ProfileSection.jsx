import React, { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  GraduationCap,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  X,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { updateStudentProfile } from '../../../../api/api'

export default function ProfileSection({
  student,
  studentName = 'Student',
  studentEmail = 'student@studylk.com',
  enrollmentsCount = 0,
  approvedCount = 0,
  onLogout,
  onProfileUpdated,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Editable Form State prefilled with database data
  const [formData, setFormData] = useState({
    first_name: student?.first_name || '',
    last_name: student?.last_name || '',
    phone: student?.phone || '',
    dob: student?.dob || '',
    district: student?.district || '',
    address: student?.address || '',
    school_name: student?.school_name || '',
    school_type: student?.school_type || '',
    al_year: student?.al_year || '',
    parent_name: student?.parent_name || '',
    parent_phone: student?.parent_phone || '',
  })

  // Sync state if student prop updates
  React.useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        phone: student.phone || '',
        dob: student.dob || '',
        district: student.district || '',
        address: student.address || '',
        school_name: student.school_name || '',
        school_type: student.school_type || '',
        al_year: student.al_year || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
      })
    }
  }, [student])

  const initial = studentName ? studentName.charAt(0).toUpperCase() : 'S'

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const res = await updateStudentProfile(formData)
      if (res?.data) {
        setSaveSuccess(true)
        setIsEditing(false)
        if (onProfileUpdated) {
          onProfileUpdated(res.data)
        }
        setTimeout(() => setSaveSuccess(false), 4000)
      }
    } catch (err) {
      console.error('Failed to update profile in database', err)
      setSaveError(
        err?.response?.data?.detail ||
          'Failed to update profile. Please ensure all inputs are valid.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Profile Summary Card */}
      <Card className="flex flex-col items-center p-8 text-center h-fit">
        <div className="relative mb-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-green-800 text-3xl font-black text-white shadow-lg shadow-emerald-700/25 ring-4 ring-emerald-50">
            {initial}
          </div>
          {student?.is_verified && (
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-black text-[#1A3A1A]">{studentName}</h2>
        <p className="mb-2 text-xs text-zinc-500">{student?.email || studentEmail}</p>

        {student?.id && (
          <p className="mb-4 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Student ID: #{student.id}
          </p>
        )}

        {student?.is_verified ? (
          <Badge variant="success" className="mb-6 gap-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified Account
          </Badge>
        ) : (
          <Badge variant="warning" className="mb-6 gap-1 text-xs">
            <AlertCircle className="h-3.5 w-3.5" /> Pending Email Verification
          </Badge>
        )}

        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-[#FAFDF9] p-3">
            <span className="text-lg font-black text-emerald-700">
              {enrollmentsCount}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">
              Enrolled Courses
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-[#FAFDF9] p-3">
            <span className="text-lg font-black text-green-700">
              {approvedCount}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">
              Active Courses
            </span>
          </div>
        </div>

        <div className="w-full space-y-2">
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full gap-2 font-bold border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              <Edit3 className="h-4 w-4 text-emerald-600" /> Edit Database Profile
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              className="w-full gap-2 font-bold"
            >
              <X className="h-4 w-4" /> Cancel Editing
            </Button>
          )}

          <Button
            variant="danger"
            onClick={onLogout}
            className="w-full gap-2 font-bold"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </Card>

      {/* Right Details & Edit Form */}
      <div className="space-y-6 lg:col-span-2">
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Profile details updated and saved successfully to database!</span>
          </div>
        )}

        {saveError && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {isEditing ? (
          /* Editable Form Mode */
          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-base">Edit Account Information</CardTitle>
                  </div>
                  <Badge variant="default" className="text-xs">Editing</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">First Name</label>
                    <Input
                      value={formData.first_name}
                      onChange={e => handleChange('first_name', e.target.value)}
                      placeholder="e.g. Kavindu"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Last Name</label>
                    <Input
                      value={formData.last_name}
                      onChange={e => handleChange('last_name', e.target.value)}
                      placeholder="e.g. Perera"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Phone Number</label>
                    <Input
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="07XXXXXXXX"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Date of Birth</label>
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={e => handleChange('dob', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">District / Region</label>
                    <Input
                      value={formData.district}
                      onChange={e => handleChange('district', e.target.value)}
                      placeholder="e.g. Colombo, Kandy, Galle"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Target A/L Year</label>
                    <Input
                      value={formData.al_year}
                      onChange={e => handleChange('al_year', e.target.value)}
                      placeholder="e.g. 2026"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-700">School Name</label>
                    <Input
                      value={formData.school_name}
                      onChange={e => handleChange('school_name', e.target.value)}
                      placeholder="e.g. Royal College Colombo"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-700">Residential Address</label>
                    <Input
                      value={formData.address}
                      onChange={e => handleChange('address', e.target.value)}
                      placeholder="Street address, City"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Parent / Guardian Name</label>
                    <Input
                      value={formData.parent_name}
                      onChange={e => handleChange('parent_name', e.target.value)}
                      placeholder="Parent's Name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700">Parent / Guardian Phone</label>
                    <Input
                      value={formData.parent_phone}
                      onChange={e => handleChange('parent_phone', e.target.value)}
                      placeholder="07XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="gap-2 font-bold"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving to DB…' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        ) : (
          /* Read-Only Database Information View */
          <>
            {/* Personal & Contact Information */}
            <Card>
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-base">
                      Account & Personal Details (From Database)
                    </CardTitle>
                  </div>
                  <Badge variant="default" className="text-xs">Database Synced</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      First Name
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.first_name || '—'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Last Name
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.last_name || '—'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-emerald-600" /> Email Address (Registration)
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.email || studentEmail}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-emerald-600" /> Phone Number (Registration)
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.phone || 'Not provided'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-emerald-600" /> Date of Birth (Registration)
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.dob || 'Not provided'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-600" /> District / Region
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.district || 'Not provided'}
                    </div>
                  </div>

                  {student?.address && (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                        <Home className="h-3 w-3 text-emerald-600" /> Address
                      </span>
                      <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                        {student.address}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic & Guardian Information */}
            <Card>
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base">Academic & Guardian Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      School Name
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.school_name || 'Not specified'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Target / A/L Year
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.al_year ? `${student.al_year} A/L` : 'G.C.E. A/L'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Parent / Guardian Name
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.parent_name || 'Not specified'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Parent Phone
                    </span>
                    <div className="rounded-xl border border-zinc-100 bg-[#FAFDF9] p-3 text-sm font-semibold text-[#1A3A1A]">
                      {student?.parent_phone || 'Not specified'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Security & Synchronisation status */}
            <Card>
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base">Data Security & Account Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2.5 text-xs text-zinc-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Live Database Sync:</strong> Your profile is loaded securely from the PostgreSQL/SQLite database via authenticated JWT token.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Enrollment Access:</strong> All courses and materials approved by teachers are bound to your student account ID <strong>#{student?.id || '—'}</strong>.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
