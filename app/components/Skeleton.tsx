"use client"

import { motion } from "framer-motion"

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-gray-200 dark:bg-gray-700/50 animate-pulse p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-lg" />
        <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
      <div className="mt-2 flex gap-2">
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
      <div className="mt-3">
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-3/4 mt-1 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
      <div className="mt-4 h-1.5 w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  )
}

export function SkeletonLevelCard() {
  return (
    <div className="rounded-2xl bg-gray-100 dark:bg-gray-800/50 animate-pulse p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
      <div className="mt-3 h-1.5 w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-xl" />
        <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonTextsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}