"use client"

import { Task, FilterType } from '@/lib/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  filter: FilterType
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  isLoading?: boolean
}

export default function TaskList({ 
  tasks, 
  filter, 
  onUpdateTask, 
  onDeleteTask, 
  isLoading = false 
}: TaskListProps) {
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed
      case 'completed':
        return task.completed
      default:
        return true
    }
  })

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {filter === 'completed' ? 'No completed tasks' : 
           filter === 'active' ? 'No active tasks' : 'No tasks yet'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {filter === 'completed' ? 'Complete some tasks to see them here.' :
           filter === 'active' ? 'All tasks are completed!' : 'Add a task to get started.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
