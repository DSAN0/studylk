import { Navigate } from 'react-router-dom'

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('adminAccessToken')
  return token ? children : <Navigate to="/admin/login" replace />
}
