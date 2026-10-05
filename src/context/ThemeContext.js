'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({})

// Hindi translations for key UI strings
const TRANSLATIONS = {
  en: {
    home: 'Home',
    services: 'All Services',
    myBookings: 'My Bookings',
    myDevices: 'My Devices',
    profile: 'Profile',
    carePlan: 'Care Plan',
    locate: 'Locate Centre',
    login: 'Login',
    logout: 'Logout',
    bookService: 'Book a Service',
    browseServices: 'Browse Services',
    darkMode: 'Dark',
    lightMode: 'Light',
    language: 'हिं',
  },
  hi: {
    home: 'होम',
    services: 'सभी सेवाएं',
    myBookings: 'मेरी बुकिंग',
    myDevices: 'मेरे उपकरण',
    profile: 'प्रोफ़ाइल',
    carePlan: 'केयर प्लान',
    locate: 'सेंटर खोजें',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    bookService: 'सेवा बुक करें',
    browseServices: 'सेवाएं देखें',
    darkMode: 'डार्क',
    lightMode: 'लाइट',
    language: 'EN',
  },
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    try {
      const savedDark = localStorage.getItem('resq_dark') === '1'
      const savedLang = localStorage.getItem('resq_lang') || 'en'
      setDark(savedDark)
      setLang(savedLang)
    } catch {}
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem('resq_dark', dark ? '1' : '0') } catch {}
  }, [dark])

  useEffect(() => {
    try { localStorage.setItem('resq_lang', lang) } catch {}
  }, [lang])

  function toggleDark() { setDark(d => !d) }
  function toggleLang() { setLang(l => l === 'en' ? 'hi' : 'en') }

  const t = TRANSLATIONS[lang]

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, lang, toggleLang, t }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
