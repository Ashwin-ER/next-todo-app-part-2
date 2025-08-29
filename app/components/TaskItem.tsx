"use client"

import { useState } from 'react'
import { Task } from '@/lib/types'
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn, formatDate } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export default function TaskItem({ task, onUpdate, onDelete, isLoading = false }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed })
  }

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <div className={cn(
      "group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 animate-fade-in",
      task.completed && "opacity-75",
      isLoading && "pointer-events-none opacity-50"
    )}>
      <div className="flex items-center space-x-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
            task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 dark:border-gray-600 hover:border-green-400"
          )}
        >
          {task.completed && <CheckIcon className="w-3 h-3" />}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full px-2 py-1 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          ) : (
            <div className="space-y-1">
              <p className={cn(
                "text-sm font-medium transition-all duration-200",
                task.completed 
                  ? "line-through text-gray-500 dark:text-gray-400" 
                  : "text-gray-900 dark:text-white"
              )}>
                {task.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created {formatDate(task.created_at)}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors duration-200"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
