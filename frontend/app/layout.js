import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import AppProvider from '@/context/AppContext'
import Layout from '@/components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Crypto Trading Journal',
  description: 'Track and analyze your cryptocurrency trades',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <Layout>
              {children}
            </Layout>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}