import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata = {
  title: "Slovak Game",
  description: "Изучение словацкого языка",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem("slovak_theme");
                  const darkMode = saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
                  if (darkMode) {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  )
}