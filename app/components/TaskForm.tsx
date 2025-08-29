"use client"

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

interface TaskFormProps {
  onAddTask: (title: string) => void
  isLoading?: boolean
}

export default function TaskForm({ onAddTask, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title.trim())
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full pl-4 pr-12 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-lg transition-colors duration-200 group"
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  )
}
