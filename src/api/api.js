import axios from 'axios'

const api = axios.create({
  baseURL: 'https://web-production-eb900.up.railway.app/api',
  timeout: 10000,
})

function studentAuthHeader() {
  const token = localStorage.getItem('studentAccessToken')

  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
}

function adminAuthHeader() {
  const token = localStorage.getItem('adminAccessToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Public APIs
export const getStreams = () => api.get('/streams/')

export const getSubjects = streamId =>
  api.get(`/streams/${streamId}/subjects/`)

export const getCourses = (streamId, subjectId) =>
  api.get(`/streams/${streamId}/${subjectId}/courses/`)

export const getCourseDetail = (streamId, subjectId, courseId) =>
  api.get(`/streams/${streamId}/${subjectId}/courses/${courseId}/`)

// Student auth
export const studentRegister = data =>
  api.post('/students/register/', data)

export const studentLogin = data =>
  api.post('/students/login/', data)

export const studentProfile = () =>
  api.get('/students/profile/', {
    headers: studentAuthHeader(),
  })

export const studentMyCourses = () =>
  api.get('/students/my-courses/', {
    headers: studentAuthHeader(),
  })

// Enrollment
export const createEnrollment = data =>
  api.post('/enrollments/', data, {
    headers: studentAuthHeader(),
  })

// Student materials
export const studentCourseMaterials = courseId =>
  api.get(`/students/courses/${courseId}/materials/`, {
    headers: studentAuthHeader(),
  })

// Student daily questions
export const studentDailyQuestions = courseId =>
  api.get(`/students/courses/${courseId}/daily-questions/`, {
    headers: studentAuthHeader(),
  })

export const studentSubmitDailyQuestion = data =>
  api.post('/students/daily-questions/submit/', data, {
    headers: studentAuthHeader(),
  })

// Student topic practice
export const getCourseTopics = courseId =>
  api.get(`/students/courses/${courseId}/topics/`, {
    headers: studentAuthHeader(),
  })

export const getTopicQuestions = topicId =>
  api.get(`/students/topics/${topicId}/questions/`, {
    headers: studentAuthHeader(),
  })

// Student question papers
export const studentQuestionPapers = courseId =>
  api.get(`/students/courses/${courseId}/papers/`, {
    headers: studentAuthHeader(),
  })

export const studentStartPaper = paperId =>
  api.post(
    `/students/papers/${paperId}/start/`,
    {},
    {
      headers: studentAuthHeader(),
    }
  )

export const studentSubmitPaper = (attemptId, data) =>
  api.post(`/students/paper-attempts/${attemptId}/submit/`, data, {
    headers: studentAuthHeader(),
  })

export const studentPaperResult = attemptId =>
  api.get(`/students/paper-attempts/${attemptId}/result/`, {
    headers: studentAuthHeader(),
  })

// Admin auth
export const adminLogin = data =>
  api.post('/admin/login/', data)

// Admin courses
export const adminGetCourses = () =>
  api.get('/admin/courses/', {
    headers: adminAuthHeader(),
  })

export const adminCreateCourse = data =>
  api.post('/admin/courses/', data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateCourse = (id, data) =>
  api.put(`/admin/courses/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteCourse = id =>
  api.delete(`/admin/courses/${id}/`, {
    headers: adminAuthHeader(),
  })

export const adminGetSubjects = () =>
  api.get('/admin/subjects/', {
    headers: adminAuthHeader(),
  })

export const adminGetTeachers = () =>
  api.get('/admin/teachers/', {
    headers: adminAuthHeader(),
  })

export const adminGetRegistrations = () =>
  api.get('/admin/registrations/', {
    headers: adminAuthHeader(),
  })

// Admin enrollments
export const adminGetEnrollments = () =>
  api.get('/admin/enrollments/', {
    headers: adminAuthHeader(),
  })

export const adminApproveEnrollment = id =>
  api.post(
    `/admin/enrollments/${id}/approve/`,
    {},
    {
      headers: adminAuthHeader(),
    }
  )

export const adminRejectEnrollment = (id, data = {}) =>
  api.post(`/admin/enrollments/${id}/reject/`, data, {
    headers: adminAuthHeader(),
  })

export const adminGetApprovedStudents = () =>
  api.get('/admin/approved-students/', {
    headers: adminAuthHeader(),
  })

// Admin materials
export const adminGetMaterials = () =>
  api.get('/admin/materials/', {
    headers: adminAuthHeader(),
  })

export const adminCreateMaterial = data =>
  api.post('/admin/materials/', data, {
    headers: {
      ...adminAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  })

export const adminUpdateMaterial = (id, data) =>
  api.put(`/admin/materials/${id}/`, data, {
    headers: {
      ...adminAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  })

export const adminDeleteMaterial = id =>
  api.delete(`/admin/materials/${id}/`, {
    headers: adminAuthHeader(),
  })

// Admin daily questions
export const adminGetDailyQuestions = () =>
  api.get('/admin/daily-questions/', {
    headers: adminAuthHeader(),
  })

export const adminCreateDailyQuestion = data =>
  api.post('/admin/daily-questions/', data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateDailyQuestion = (id, data) =>
  api.put(`/admin/daily-questions/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteDailyQuestion = id =>
  api.delete(`/admin/daily-questions/${id}/`, {
    headers: adminAuthHeader(),
  })

// Admin question papers
export const adminGetQuestionPapers = () =>
  api.get('/admin/question-papers/', {
    headers: adminAuthHeader(),
  })

export const adminCreateQuestionPaper = data =>
  api.post('/admin/question-papers/', data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateQuestionPaper = (id, data) =>
  api.put(`/admin/question-papers/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteQuestionPaper = id =>
  api.delete(`/admin/question-papers/${id}/`, {
    headers: adminAuthHeader(),
  })

// Admin paper questions
export const adminGetPaperQuestions = paperId =>
  api.get(`/admin/question-papers/${paperId}/questions/`, {
    headers: adminAuthHeader(),
  })

export const adminCreatePaperQuestion = (paperId, data) =>
  api.post(`/admin/question-papers/${paperId}/questions/`, data, {
    headers: adminAuthHeader(),
  })

export const adminUpdatePaperQuestion = (id, data) =>
  api.put(`/admin/paper-questions/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeletePaperQuestion = id =>
  api.delete(`/admin/paper-questions/${id}/`, {
    headers: adminAuthHeader(),
  })

// Admin topic practice
export const adminGetTopics = () =>
  api.get('/admin/topics/', {
    headers: adminAuthHeader(),
  })

export const adminCreateTopic = data =>
  api.post('/admin/topics/', data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateTopic = (id, data) =>
  api.put(`/admin/topics/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteTopic = id =>
  api.delete(`/admin/topics/${id}/`, {
    headers: adminAuthHeader(),
  })

export const adminGetTopicQuestions = topicId =>
  api.get(`/admin/topics/${topicId}/questions/`, {
    headers: adminAuthHeader(),
  })

export const adminCreateTopicQuestion = (topicId, data) =>
  api.post(`/admin/topics/${topicId}/questions/`, data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateTopicQuestion = (id, data) =>
  api.put(`/admin/topic-questions/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteTopicQuestion = id =>
  api.delete(`/admin/topic-questions/${id}/`, {
    headers: adminAuthHeader(),
  })

export default api