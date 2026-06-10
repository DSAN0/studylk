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

export default function App() {
  return (
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

          {/* Student Area */}
          <Route path="/my-courses" element={<MyCourses />} />

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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}