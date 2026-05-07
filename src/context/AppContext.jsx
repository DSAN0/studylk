import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [whatsappNumber, setWhatsappNumber] = useState(
    import.meta.env.VITE_WHATSAPP_NUMBER || '94771234567'
  )

  function buildWhatsAppLink(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <AppContext.Provider value={{ whatsappNumber, setWhatsappNumber, buildWhatsAppLink }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
