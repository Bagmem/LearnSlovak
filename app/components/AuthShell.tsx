import Link from "next/link"
import { ReactNode } from "react"

type AuthShellProps = {
  title: string
  subtitle: string
  icon: ReactNode
  backgroundImage: string
  children: ReactNode
}

export default function AuthShell({
  title,
  subtitle,
  icon,
  backgroundImage,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.25),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),_transparent_35%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl">
              {icon}
            </div>

            <h1 className="text-3xl font-black drop-shadow-lg">{title}</h1>

            <p className="mt-2 text-sm text-gray-200">{subtitle}</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            {children}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm font-bold text-gray-200 hover:text-white"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}