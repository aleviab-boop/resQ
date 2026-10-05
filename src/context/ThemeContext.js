'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import T from '@/lib/translations'

const ThemeContext = createContext({})

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

  const t = T[lang] || T.en

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, lang, toggleLang, t }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
