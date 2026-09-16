import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import 'katex/dist/katex.min.css'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Streams from './pages/Streams'
import Subjects from './pages/Subjects'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import MyCourses from './pages/MyCourses'
import MyAccount from './pages/MyAccount'
import EnrollCourse from './pages/EnrollCourse'
import CourseOverview from './pages/CourseOverview'
import CourseMaterials from './pages/CourseMaterials'
import DailyQuestions from './pages/DailyQuestions'
import CoursePapers from './pages/CoursePapers'
import TakePaper from './pages/TakePaper'
import PaperResult from './pages/PaperResult'
import TopicPracticeList from './pages/TopicPracticeList'
import TopicQuestions from './pages/TopicQuestions'
import TheoryViewer from './pages/TheoryViewer'
import PastPapers    from './pages/PastPapers'
import PastPaperView from './pages/PastPaperView'
import ExplorePastPapers  from './pages/ExplorePastPapers'
import ExploreModelPapers from './pages/ExploreModelPapers'
import ExploreSchoolPapers from './pages/ExploreSchoolPapers'
import ExploreNotes        from './pages/ExploreNotes'
import ExploreHub          from './pages/ExploreHub'
import ExploreALStreams    from './pages/ExploreALStreams'
import ExploreSubjects     from './pages/ExploreSubjects'
import ExploreContentType  from './pages/ExploreContentType'

import OLPapers     from './pages/pastpapers/OLPapers'
import ALStreams    from './pages/pastpapers/ALStreams'
import ALSubjects   from './pages/pastpapers/ALSubjects'
import Grade5Papers from './pages/pastpapers/Grade5Papers'
import PaperViewer  from './pages/pastpapers/PaperViewer'

import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminCourseForm from './admin/pages/AdminCourseForm'
import AdminMaterials from './admin/pages/AdminMaterials'
import AdminApprovedStudents from './admin/pages/AdminApprovedStudents'
import AdminDailyQuestions from './admin/pages/AdminDailyQuestions'
import AdminQuestionPapers from './admin/pages/AdminQuestionPapers'
import AdminPaperQuestions from './admin/pages/AdminPaperQuestions'
import AdminTopicPractice from './admin/pages/AdminTopicPractice'
import AdminTopicQuestions from './admin/pages/AdminTopicQuestions'
import AdminTheory from './admin/pages/AdminTheory'
import AdminTheorySections from './admin/pages/AdminTheorySections'
import AdminPastPapers from './admin/pages/AdminPastPapers'
import AdminPastPaperQuestions from './admin/pages/AdminPastPaperQuestions'
import AdminExplorePapers from './admin/pages/AdminExplorePapers'
import AdminExplorePaperMCQ from './admin/pages/AdminExplorePaperMCQ'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function App() {
  const content = (
    <AppProvider>
      <BrowserRouter>
        <Navbar />


        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/streams" element={<Streams />} />
          <Route path="/streams/:streamId" element={<Subjects />} />
          <Route path="/streams/:streamId/:subjectId" element={<Courses />} />
          <Route
            path="/streams/:streamId/:subjectId/:courseId"
            element={<CourseDetail />}
          />

          {/* Student Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Student Account & Learning Hub */}
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/my-courses" element={<MyAccount defaultTab="courses" />} />

          <Route
            path="/my-courses/:courseId/overview"
            element={<CourseOverview />}
          />

          <Route
            path="/my-courses/:courseId/theory"
            element={<TheoryViewer />}
          />

          <Route
            path="/my-courses/:courseId/materials"
            element={<CourseMaterials />}
          />

          <Route
            path="/my-courses/:courseId/daily-questions"
            element={<DailyQuestions />}
          />

          <Route
            path="/my-courses/:courseId/topic-practice"
            element={<TopicPracticeList />}
          />

          <Route
            path="/topic-questions/:topicId"
            element={<TopicQuestions />}
          />

          <Route
            path="/my-courses/:courseId/papers"
            element={<CoursePapers />}
          />

          <Route
            path="/enroll/:streamId/:subjectId/:courseId"
            element={<EnrollCourse />}
          />

          <Route path="/papers/:paperId/take" element={<TakePaper />} />
          <Route path="/paper-result/:attemptId" element={<PaperResult />} />

          <Route
            path="/my-courses/:courseId/past-papers"
            element={<PastPapers />}
          />

          <Route
            path="/my-courses/:courseId/past-papers/:paperId"
            element={<PastPaperView />}
          />

          {/* ── New Explore flow ── */}
          {/* Step 1: Grade select */}
          <Route path="/explore" element={<ExploreHub />} />

          {/* Step 2a: O/L subject select */}
          <Route path="/explore/ol" element={<ExploreSubjects grade="ol" />} />

          {/* Step 2b: Grade 5 subject select */}
          <Route path="/explore/grade5" element={<ExploreSubjects grade="grade5" />} />

          {/* Step 2c: A/L stream select */}
          <Route path="/explore/al" element={<ExploreALStreams />} />

          {/* Step 3: A/L subject select (after stream) */}
          <Route path="/explore/al/:stream" element={<ExploreSubjects grade="al" />} />

          {/* Step 4 (final): Content type chooser */}
          <Route path="/explore/ol/:subjectId/choose"              element={<ExploreContentType grade="ol" />} />
          <Route path="/explore/grade5/:subjectId/choose"          element={<ExploreContentType grade="grade5" />} />
          <Route path="/explore/al/:stream/:subjectId/choose"      element={<ExploreContentType grade="al" />} />

          {/* Legacy / Direct Explore Hubs */}
          <Route path="/explore/past-papers"   element={<ExplorePastPapers />} />
          <Route path="/explore/model-papers"  element={<ExploreModelPapers />} />
          <Route path="/explore/school-papers" element={<ExploreSchoolPapers />} />
          <Route path="/explore/notes"         element={<ExploreNotes />} />

          {/* Past Papers */}
          <Route path="/explore/past-papers/ol"                   element={<OLPapers />} />
          <Route path="/explore/past-papers/ol/:subject"          element={<PaperViewer grade="OL" />} />
          <Route path="/explore/past-papers/al"                   element={<ALStreams />} />
          <Route path="/explore/past-papers/al/:stream"           element={<ALSubjects />} />
          <Route path="/explore/past-papers/al/:stream/:subject"  element={<PaperViewer grade="AL" />} />
          <Route path="/explore/past-papers/grade5"               element={<Grade5Papers />} />
          <Route path="/explore/past-papers/grade5/:subject"      element={<PaperViewer grade="Grade5" />} />

          {/* Model Papers */}
          <Route path="/explore/model-papers/ol/:subject"          element={<ExploreModelPapers grade="OL" />} />
          <Route path="/explore/model-papers/al/:stream/:subject"  element={<ExploreModelPapers grade="AL" />} />
          <Route path="/explore/model-papers/grade5/:subject"      element={<ExploreModelPapers grade="Grade5" />} />

          {/* School Papers */}
          <Route path="/explore/school-papers/ol/:subject"          element={<ExploreSchoolPapers grade="OL" />} />
          <Route path="/explore/school-papers/al/:stream/:subject"  element={<ExploreSchoolPapers grade="AL" />} />
          <Route path="/explore/school-papers/grade5/:subject"      element={<ExploreSchoolPapers grade="Grade5" />} />

          {/* Notes */}
          <Route path="/explore/notes/ol/:subject"          element={<ExploreNotes grade="OL" />} />
          <Route path="/explore/notes/al/:stream/:subject"  element={<ExploreNotes grade="AL" />} />
          <Route path="/explore/notes/grade5/:subject"      element={<ExploreNotes grade="Grade5" />} />


          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/courses/new"
            element={
              <ProtectedAdminRoute>
                <AdminCourseForm />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/courses/:courseId"
            element={
              <ProtectedAdminRoute>
                <AdminCourseForm />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/materials"
            element={
              <ProtectedAdminRoute>
                <AdminMaterials />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/approved-students"
            element={
              <ProtectedAdminRoute>
                <AdminApprovedStudents />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/daily-questions"
            element={
              <ProtectedAdminRoute>
                <AdminDailyQuestions />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/question-papers"
            element={
              <ProtectedAdminRoute>
                <AdminQuestionPapers />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/question-papers/:paperId/questions"
            element={
              <ProtectedAdminRoute>
                <AdminPaperQuestions />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/topic-practice"
            element={
              <ProtectedAdminRoute>
                <AdminTopicPractice />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/topic-practice/:topicId/questions"
            element={
              <ProtectedAdminRoute>
                <AdminTopicQuestions />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/theory"
            element={
              <ProtectedAdminRoute>
                <AdminTheory />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/theory/:topicId/sections"
            element={
              <ProtectedAdminRoute>
                <AdminTheorySections />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/past-papers"
            element={
              <ProtectedAdminRoute>
                <AdminPastPapers />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/past-papers/:paperId/questions"
            element={
              <ProtectedAdminRoute>
                <AdminPastPaperQuestions />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/explore-papers"
            element={
              <ProtectedAdminRoute>
                <AdminExplorePapers />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/explore-papers/:paperId/mcq"
            element={
              <ProtectedAdminRoute>
                <AdminExplorePaperMCQ />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )

  if (GOOGLE_CLIENT_ID) {
    return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{content}</GoogleOAuthProvider>
  }

  return content
}