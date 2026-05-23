import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Slovak Game",
  description: "Изучение словацкого языка",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}