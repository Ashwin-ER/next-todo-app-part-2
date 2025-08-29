import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { action, data, userId, message, source } = await request.json()
    
    console.log('🤖 Chatbot API called:', { action, source, userId })
    
    switch (action) {
      case 'add_task':
        return await handleAddTask(data, userId)
      case 'enhance_task':
        return await handleEnhanceTask(data)
      case 'list_tasks':
        return await handleListTasks(userId)
      case 'complete_task':
        return await handleCompleteTask(data, userId)
      case 'process_whatsapp':
        return await handleWhatsAppMessage(message, userId)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Chatbot API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function handleAddTask(taskData: any, userId: string) {
  const supabase = await createServerSupabaseClient()
  
  // First, enhance the task with AI
  const enhancedTask = await enhanceTaskWithAI(taskData.title)
  
  const { data: task, error } = await supabase
    .from('tasks')
    .insert([
      {
        title: enhancedTask.title,
        description: enhancedTask.description,
        user_id: userId,
        enhanced: true,
        source: taskData.source || 'chatbot'
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    task,
    enhancement: enhancedTask,
    message: `✅ Task created and enhanced with AI!`
  })
}

async function handleEnhanceTask(taskData: any) {
  const enhanced = await enhanceTaskWithAI(taskData.title)
  
  return NextResponse.json({
    success: true,
    original: taskData.title,
    enhanced: enhanced,
    suggestions: enhanced.steps || []
  })
}

async function handleListTasks(userId: string) {
  const supabase = await createServerSupabaseClient()
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const taskList = tasks.map(task => 
    `${task.completed ? '✅' : '⭕'} ${task.title}`
  ).join('\n')

  return NextResponse.json({
    success: true,
    tasks: tasks,
    message: `📋 Your recent tasks:\n\n${taskList}`
  })
}

async function handleCompleteTask(taskData: any, userId: string) {
  const supabase = await createServerSupabaseClient()
  
  // Find task by title or ID
  const { data: task, error } = await supabase
    .from('tasks')
    .update({ completed: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .ilike('title', `%${taskData.title}%`)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    task,
    message: `🎉 Task "${task.title}" marked as complete!`
  })
}

async function handleWhatsAppMessage(message: string, userId: string) {
  // Parse WhatsApp message for todo commands
  const todoMatch = message.match(/#to-do\s+(.+)/i)
  
  if (todoMatch) {
    const taskTitle = todoMatch.trim()
    return await handleAddTask({ title: taskTitle, source: 'whatsapp' }, userId)
  }
  
  // Check for other commands
  if (message.toLowerCase().includes('list') || message.toLowerCase().includes('show tasks')) {
    return await handleListTasks(userId)
  }
  
  if (message.toLowerCase().includes('complete') || message.toLowerCase().includes('done')) {
    const taskTitle = message.replace(/complete|done/i, '').trim()
    return await handleCompleteTask({ title: taskTitle }, userId)
  }
  
  return NextResponse.json({
    success: true,
    message: `🤖 Hi! Send me "#to-do [task]" to add tasks, or "list" to see your tasks!`
  })
}

async function enhanceTaskWithAI(title: string) {
  try {
    // Using OpenAI API (you can replace with Gemini or other AI)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a task enhancement AI. Given a task title, make it clearer and more actionable. 
            Respond with JSON: {"title": "enhanced title", "description": "detailed description", "steps": ["step1", "step2"]}`
          },
          {
            role: 'user',
            content: `Enhance this task: "${title}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    const aiResponse = await response.json()
    const enhanced = JSON.parse(aiResponse.choices.message.content)
    
    return {
      title: enhanced.title || title,
      description: enhanced.description || '',
      steps: enhanced.steps || [],
      enhanced_by: 'AI'
    }
  } catch (error) {
    console.error('AI Enhancement error:', error)
    return {
      title: title,
      description: 'Enhanced task description',
      steps: [],
      enhanced_by: 'fallback'
    }
  }
}