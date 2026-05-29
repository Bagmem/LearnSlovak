"use client"

import { Toaster } from 'react-hot-toast'
import { useTheme } from '../../../hooks/useTheme'

export default function ToastProvider() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
          borderRadius: '12px',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
        },
      }}
    />
  )
}