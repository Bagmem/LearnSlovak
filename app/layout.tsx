import { Inter } from 'next/font/google'
import "./globals.css"
import ToastProvider from "./components/shared/ToastProvider"
import ThemeInitializer from "./components/shared/ThemeInitializer"

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata = {
  title: "Learn Slovak",
  description: "Изучение словацкого языка",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <ThemeInitializer />
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}