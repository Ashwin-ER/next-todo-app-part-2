export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export type FilterType = 'all' | 'active' | 'completed'

export interface TaskFormData {
  title: string
}

export interface UserFormData {
  name: string
  email: string
}
