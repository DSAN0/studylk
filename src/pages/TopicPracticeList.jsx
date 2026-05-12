import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseTopics } from '../api/api'

export default function TopicPracticeList() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await getCourseTopics(courseId)
        setTopics(res.data)
      } catch (err) {
        alert(JSON.stringify(err.response?.data || 'Could not load topics'))
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [courseId])

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.loading}>Loading topics…</p>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button
          style={styles.backBtn}
          onClick={() => navigate(`/my-courses/${courseId}/overview`)}
        >
          ← Back to Course
        </button>

        <h1 style={styles.title}>Topic Practice</h1>
        <p style={styles.subtitle}>
          Select a topic and practice MCQ questions without time limit.
        </p>

        <div style={styles.grid}>
          {topics.map(topic => (
            <div key={topic.id} style={styles.card}>
              <div style={styles.icon}>📚</div>

              <h2 style={styles.cardTitle}>{topic.title}</h2>

              <p style={styles.cardText}>
                Practice questions from this topic with instant answers and explanations.
              </p>

              <button
                style={styles.startBtn}
                onClick={() => navigate(`/topic-questions/${topic.id}`)}
              >
                Start Practice →
              </button>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <p style={styles.empty}>No topics available yet.</p>
        )}
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FBF8',
    paddingTop: 100,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#1A3A1A',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 24px 80px',
  },
  backBtn: {
    background: 'white',
    border: '1.5px solid #A5D6A7',
    color: '#2E7D32',
    borderRadius: 50,
    padding: '8px 18px',
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 24,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 900,
    marginBottom: 8,
  },
  subtitle: {
    color: '#5A7A5A',
    marginBottom: 32,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 22,
  },
  card: {
    background: 'white',
    border: '1.5px solid #E8F5E9',
    borderRadius: 24,
    padding: 28,
    boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
  },
  icon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)',
    border: '1.5px solid #D8B4FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.7rem',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 900,
    marginBottom: 10,
  },
  cardText: {
    fontSize: '0.85rem',
    color: '#5A7A5A',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  startBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    color: 'white',
    border: 'none',
    borderRadius: 50,
    padding: '12px 20px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    fontWeight: 700,
    color: '#5A7A5A',
  },
  empty: {
    marginTop: 30,
    textAlign: 'center',
    color: '#5A7A5A',
    fontWeight: 700,
  },
}