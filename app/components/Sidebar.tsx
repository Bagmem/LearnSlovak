"use client"

import { motion } from "framer-motion"
import { FaBullseye, FaBookOpen, FaScroll, FaUserCircle, FaSignOutAlt, FaCog, FaClipboardList } from "react-icons/fa"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

type TabId = "study" | "texts" | "test" | "reference"

type SidebarProps = {
  user: User | null
  globalTab: TabId
  onTabChange: (tab: TabId) => void
  onSettingsClick: () => void
  onLogout: () => void
  getUserDisplayName: (user: User) => string
  onLoginClick: () => void
  onRegisterClick: () => void
}

export default function Sidebar({
  user,
  globalTab,
  onTabChange,
  onSettingsClick,
  onLogout,
  getUserDisplayName,
  onLoginClick,
  onRegisterClick,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl z-30 flex flex-col border-r border-gray-200/50 dark:border-gray-700/50">
      <div className="px-5 pt-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          LearnSlovak
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {([
          { id: "study", label: "Изучение", icon: <FaBullseye size={20} />, active: globalTab === "study" },
          { id: "texts", label: "Тексты", icon: <FaScroll size={20} />, active: globalTab === "texts" },
          { id: "test", label: "Тест", icon: <FaClipboardList size={20} />, active: globalTab === "test" },
          { id: "reference", label: "Справочник", icon: <FaBookOpen size={20} />, active: globalTab === "reference" },
        ] as const).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              item.active
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
            aria-label={item.label}
          >
            <span className={`${item.active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors"}`}>
              {item.icon}
            </span>
            <span className="font-bold text-sm">{item.label}</span>
            {item.active && (
              <motion.div
                layoutId="activeNav"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
        {user ? (
          <>
            <button
              onClick={onSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
            >
              <FaCog size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-bold text-sm">Настройки</span>
            </button>
            <Link
              href="/profile"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
            >
              <FaUserCircle size={20} className="group-hover:scale-105 transition-transform" />
              <span className="font-bold text-sm">Мой профиль</span>
            </Link>
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                  <FaUserCircle size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                  {getUserDisplayName(user)}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"
                title="Выйти"
                aria-label="Выйти из аккаунта"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onLoginClick}
              className="w-full py-2.5 text-center text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              Войти
            </button>
            <button
              onClick={onRegisterClick}
              className="w-full py-2.5 text-center text-sm font-bold border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-800 dark:text-gray-200"
            >
              Регистрация
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}