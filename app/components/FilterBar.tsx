"use client"

import { FilterType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  taskCounts: {
    all: number
    active: number
    completed: number
  }
}

export default function FilterBar({ currentFilter, onFilterChange, taskCounts }: FilterBarProps) {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ]

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex space-x-1">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              currentFilter === filter.key
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            {filter.label}
            <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded-full">
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {taskCounts.active} {taskCounts.active === 1 ? 'item' : 'items'} left
      </div>
    </div>
  )
}
