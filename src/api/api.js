import axios from 'axios'

const api = axios.create({
  baseURL: 'https://web-production-eb900.up.railway.app/api',
  timeout: 30000,   // increased from 10000 → email APIs can take a moment
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

function isAdminRequest(url = '') {
  return url.startsWith('/admin/')
}

function getAccessToken(url = '') {
  return isAdminRequest(url)
    ? localStorage.getItem('adminAccessToken')
    : localStorage.getItem('studentAccessToken')
}

function getRefreshToken(url = '') {
  return isAdminRequest(url)
    ? localStorage.getItem('adminRefreshToken')
    : localStorage.getItem('studentRefreshToken')
}

function saveAccessToken(url = '', token) {
  if (isAdminRequest(url)) {
    localStorage.setItem('adminAccessToken', token)
  } else {
    localStorage.setItem('studentAccessToken', token)
  }
}

function logoutUser(url = '') {
  if (isAdminRequest(url)) {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin/login'
  } else {
    localStorage.removeItem('studentAccessToken')
    localStorage.removeItem('studentRefreshToken')
    localStorage.removeItem('studentUser')
    window.location.href = '/login'
  }
}

api.interceptors.request.use(config => {
  const token = getAccessToken(config.url)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === '/token/refresh/'
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = getRefreshToken(originalRequest.url)

    if (!refreshToken) {
      logoutUser(originalRequest.url)
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    isRefreshing = true

    try {
      const res = await api.post('/token/refresh/', {
        refresh: refreshToken,
      })

      const newAccessToken = res.data.access

      saveAccessToken(originalRequest.url, newAccessToken)

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      processQueue(null, newAccessToken)

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      logoutUser(originalRequest.url)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

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

export const studentVerifyEmail = data =>
  api.post('/students/verify-email/', data)

export const studentResendVerification = data =>
  api.post('/students/resend-verification/', data)

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

export function submitTopicQuestion(data) {
  return api.post('/students/topic-questions/submit/', data, {
    headers: studentAuthHeader(),
  })
}

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

// Student theory
export const getSubjectTopics = courseId =>
  api.get(`/students/courses/${courseId}/theory/topics/`, {
    headers: studentAuthHeader(),
  })

export const getTopicTheorySections = topicId =>
  api.get(`/students/theory/topics/${topicId}/sections/`, {
    headers: studentAuthHeader(),
  })

// Admin theory topics
export const adminGetTheoryTopics = () =>
  api.get('/admin/theory-topics/', {
    headers: adminAuthHeader(),
  })

export const adminCreateTheoryTopic = data =>
  api.post('/admin/theory-topics/', data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateTheoryTopic = (id, data) =>
  api.put(`/admin/theory-topics/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteTheoryTopic = id =>
  api.delete(`/admin/theory-topics/${id}/`, {
    headers: adminAuthHeader(),
  })

// Admin theory sections
export const adminGetTheorySections = topicId =>
  api.get(`/admin/theory-topics/${topicId}/sections/`, {
    headers: adminAuthHeader(),
  })

export const adminCreateTheorySection = (topicId, data) =>
  api.post(`/admin/theory-topics/${topicId}/sections/`, data, {
    headers: adminAuthHeader(),
  })

export const adminUpdateTheorySection = (id, data) =>
  api.put(`/admin/theory-sections/${id}/`, data, {
    headers: adminAuthHeader(),
  })

export const adminDeleteTheorySection = id =>
  api.delete(`/admin/theory-sections/${id}/`, {
    headers: adminAuthHeader(),
  })

// ─────────────────────────────────────────────────────────────────────────────
// PAST PAPERS — add these functions to your existing api.js
// ─────────────────────────────────────────────────────────────────────────────

// Student past papers: list years + parts for a course
// Expected response shape:
// [
//   {
//     year: 2023,
//     papers: [
//       { id: 1, part_number: 1, part_label: "Part 1 – MCQ", question_count: 50, is_mcq: true },
//       { id: 2, part_number: 2, part_label: "Part 2 – Essay", question_count: 6, is_mcq: false }
//     ]
//   },
//   ...
// ]
export const getPastPaperYears = courseId =>
  api.get(`/students/courses/${courseId}/past-papers/`, {
    headers: studentAuthHeader(),
  })


// Student past paper questions: questions + existing MCQ attempts for a single paper part
// Expected response shape:
// {
//   paper: { id, part_number, part_label, year, is_mcq },
//   questions: [
//     // For MCQ (is_mcq: true):
//     {
//       id, question_text,
//       option_a, option_b, option_c, option_d, option_e,
//       correct_answer,   // 'A' | 'B' | 'C' | 'D' | 'E'
//       explanation       // optional
//     },
//     // For Essay (is_mcq: false):
//     {
//       id, question_text,
//       marks,            // optional integer
//       answer,           // long model answer string
//       sub_questions: [  // optional array
//         { text, marks, answer }
//       ]
//     }
//   ],
//   attempts: [           // only relevant for MCQ parts
//     { question: <questionId>, selected_answer: 'A' }
//   ]
// }
export const getPastPaperQuestions = paperId =>
  api.get(`/students/past-papers/${paperId}/questions/`, {
    headers: studentAuthHeader(),
  })


// Submit a MCQ answer for a past paper question (saves attempt)
// Payload: { question_id: <id>, selected_answer: 'A' | ... }
export const submitPastPaperMCQ = data =>
  api.post('/students/past-paper-questions/submit/', data, {
    headers: studentAuthHeader(),
  })  

export default api