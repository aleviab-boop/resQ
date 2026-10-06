import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/Toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FaqBot from '@/components/FaqBot'
import Onboarding from '@/components/Onboarding'
import BottomNav from '@/components/BottomNav'
import { ThemeProvider } from '@/context/ThemeContext'
import NotificationManager from '@/components/NotificationManager'

export const metadata = {
  title: 'Reliance resQ – Expert Home Appliance Care',
  description: 'Book repair, maintenance and installation services for all home appliances. resQ by Reliance.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="pb-16 md:pb-0">{children}</main>
            <Footer />
            <FaqBot />
            <Onboarding />
            <BottomNav />
            <NotificationManager />
          </ToastProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
