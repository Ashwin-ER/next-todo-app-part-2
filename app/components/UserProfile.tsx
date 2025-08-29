"use client"

import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {getInitials(user.name)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {user.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {user.email}
        </p>
      </div>
    </div>
  )
}
