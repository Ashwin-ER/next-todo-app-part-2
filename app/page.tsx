"use client"

import { useState, useEffect } from 'react'
import { Task, User, FilterType } from '@/lib/types'
import { generateId } from '@/lib/utils'

import ThemeToggle from './components/ThemeToggle'
import UserProfile from './components/UserProfile'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Login form states
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Explicit save function - called after every task operation
  const saveUserData = (currentUser: User, currentTasks: Task[]) => {
    try {
      const userData = {
        user: currentUser,
        tasks: currentTasks,
        lastLogin: new Date().toISOString(),
        savedAt: new Date().toISOString()
      }
      
      // Save user data
      localStorage.setItem(`taskflow_user_${currentUser.email}`, JSON.stringify(userData))
      
      // Save to email list
      const allEmails = JSON.parse(localStorage.getItem('taskflow_all_emails') || '[]')
      if (!allEmails.includes(currentUser.email)) {
        allEmails.push(currentUser.email)
        localStorage.setItem('taskflow_all_emails', JSON.stringify(allEmails))
      }
      
      console.log(`✅ Data saved for ${currentUser.email}: ${currentTasks.length} tasks`)
    } catch (error) {
      console.error('❌ Error saving data:', error)
    }
  }

  // Load user data
  const loadUserData = (email: string) => {
    try {
      const userData = localStorage.getItem(`taskflow_user_${email}`)
      if (userData) {
        const parsed = JSON.parse(userData)
        console.log(`✅ Data loaded for ${email}: ${parsed.tasks.length} tasks`)
        return parsed
      }
    } catch (error) {
      console.error('❌ Error loading data:', error)
    }
    return null
  }

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    // Validate inputs
    if (!email.trim()) {
      setLoginError('Please enter an email address')
      setLoginLoading(false)
      return
    }

    if (!name.trim()) {
      setLoginError('Please enter your name')
      setLoginLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setLoginError('Please enter a valid email address')
      setLoginLoading(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    const userEmail = email.toLowerCase().trim()
    
    // Check if user exists
    const existingData = loadUserData(userEmail)
    
    if (existingData) {
      // Returning user - load their data
      console.log(`👤 Returning user: ${userEmail}`)
      setUser(existingData.user)
      setTasks(existingData.tasks)
    } else {
      // New user - create account
      console.log(`🆕 New user: ${userEmail}`)
      const newUser: User = {
        id: generateId(),
        name: name.trim(),
        email: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const welcomeTasks: Task[] = [
        {
          id: generateId(),
          title: `Welcome to TaskFlow, ${name.split(' ')[0]}!`,
          completed: false,
          user_id: newUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: generateId(),
          title: 'Add your first personal task',
          completed: false,
          user_id: newUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]

      setUser(newUser)
      setTasks(welcomeTasks)
      
      // Immediately save new user data
      saveUserData(newUser, welcomeTasks)
    }

    setLoginLoading(false)
  }

  const handleDemoLogin = (demoEmail: string, demoName: string, demoTasks: any[]) => {
    const existingData = loadUserData(demoEmail)
    
    if (existingData) {
      console.log(`👤 Existing demo user: ${demoEmail}`)
      setUser(existingData.user)
      setTasks(existingData.tasks)
    } else {
      console.log(`🆕 New demo user: ${demoEmail}`)
      const newUser: User = {
        id: generateId(),
        name: demoName,
        email: demoEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const userTasks: Task[] = demoTasks.map(task => ({
        id: generateId(),
        title: task.title,
        completed: task.completed,
        user_id: newUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      setUser(newUser)
      setTasks(userTasks)
      
      // Immediately save demo user data
      saveUserData(newUser, userTasks)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setTasks([])
    setEmail('')
    setName('')
    setLoginError('')
  }

  const handleAddTask = (title: string) => {
    if (!user) return
    
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    
    // Immediately save after adding task
    saveUserData(user, updatedTasks)
  }

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
    )
    setTasks(updatedTasks)
    
    // Immediately save after updating task
    if (user) {
      saveUserData(user, updatedTasks)
    }
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    
    // Immediately save after deleting task
    if (user) {
      saveUserData(user, updatedTasks)
    }
  }

  // Get recent users
  const getRecentUsers = () => {
    if (!mounted) return []
    
    try {
      const allEmails = JSON.parse(localStorage.getItem('taskflow_all_emails') || '[]')
      return allEmails.map((email: string) => {
        const userData = loadUserData(email)
        return userData ? {
          email: userData.user.email,
          name: userData.user.name,
          taskCount: userData.tasks.length,
          lastLogin: userData.lastLogin
        } : null
      }).filter(Boolean).sort((a: any, b: any) => 
        new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
      ).slice(0, 3)
    } catch (error) {
      console.error('Error getting recent users:', error)
      return []
    }
  }

  // Demo users data
  const demoUsers = [
    {
      email: 'john@example.com',
      name: 'John Doe',
      tasks: [
        { title: 'Complete project documentation', completed: false },
        { title: 'Review code changes', completed: true },
        { title: 'Plan next sprint', completed: false },
      ]
    },
    {
      email: 'sarah@example.com',
      name: 'Sarah Wilson',
      tasks: [
        { title: 'Design new landing page', completed: false },
        { title: 'Update user interface', completed: false },
        { title: 'Test mobile responsiveness', completed: true },
      ]
    },
    {
      email: 'demo@taskflow.com',
      name: 'Demo User',
      tasks: [
        { title: 'Welcome to TaskFlow!', completed: false },
        { title: 'Try adding your own tasks', completed: true },
        { title: 'Toggle dark/light theme', completed: false },
      ]
    }
  ]

  // Show loading while mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show LOGIN FORM if no user is logged in
  if (!user) {
    const recentUsers = getRecentUsers()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <ThemeToggle />
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              TaskFlow
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tasks automatically saved for each email ID
            </p>
          </div>
          
          {/* Custom Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={loginLoading}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={loginLoading}
                suppressHydrationWarning
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
              suppressHydrationWarning
            >
              {loginLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In / Create Account'
              )}
            </button>
          </form>

          {/* Recent Users */}
          {recentUsers.length > 0 && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400">
                    Recent accounts
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {recentUsers.map((user: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(user.email, user.name, [])}
                    className="w-full p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.taskCount} tasks
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Demo Accounts */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400">
                Or try demo accounts
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
              Demo accounts (tasks persist):
            </p>
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(user.email, user.name, user.tasks)}
                className="w-full p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Demo
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show MAIN APP if user is logged in
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TaskFlow
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}! ({tasks.length} tasks saved)
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <UserProfile user={user} />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
          
          <TaskForm onAddTask={handleAddTask} isLoading={isLoading} />
          
          <FilterBar
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
          />
          
          <TaskList
            tasks={tasks}
            filter={filter}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}