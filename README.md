# TaskFlow - Modern Todo App

A beautiful and functional todo list built with Next.js 15, Supabase, and Tailwind CSS.

## Features

✅ **Modern UI/UX** - Clean, responsive design with Tailwind CSS
✅ **Dark/Light Mode** - Theme toggle with system preference detection  
✅ **CRUD Operations** - Create, read, update, delete tasks
✅ **Filtering** - View all, active, or completed tasks
✅ **User Management** - Simple user identification system
✅ **Persistent Data** - Supabase integration ready
✅ **Real-time Updates** - Immediate UI updates
✅ **Responsive Design** - Works on all devices
✅ **Accessibility** - Keyboard navigation and ARIA labels
✅ **Error Handling** - Form validation and error states
✅ **Loading States** - Visual feedback for async operations

## Tech Stack

- **Next.js 15** - App Router with TypeScript
- **Supabase** - Database and Authentication
- **Tailwind CSS** - Modern styling
- **Heroicons** - Beautiful icons
- **Vercel** - Deployment platform

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Project Structure

```
next-todo-app/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts     # API routes for tasks
│   └── components/
│       ├── UserProfile.tsx  # User info display
│       ├── TaskForm.tsx     # Add task form
│       ├── TaskList.tsx     # Task list container
│       ├── TaskItem.tsx     # Individual task
│       ├── FilterBar.tsx    # Filter buttons
│       └── ThemeToggle.tsx  # Dark/light mode toggle
├── lib/
│   ├── supabase.ts          # Supabase client config
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

## Usage

1. **Add Tasks** - Use the input form at the top to add new tasks
2. **Edit Tasks** - Click on a task to edit it inline
3. **Mark Complete** - Check the checkbox to mark tasks as complete
4. **Delete Tasks** - Click the delete button to remove tasks
5. **Filter Tasks** - Use the filter buttons to view all, active, or completed tasks
6. **Toggle Theme** - Click the theme toggle button to switch between light and dark modes

## Development

### Key Components

- **TaskForm** - Handles new task creation with form validation
- **TaskList** - Displays filtered tasks with empty states
- **TaskItem** - Individual task with inline editing and actions
- **FilterBar** - Task filtering and count display
- **UserProfile** - Simple user identification display
- **ThemeToggle** - Dark/light mode switcher

### State Management

The app uses React's built-in state management with hooks:
- `useState` for local component state
- `useEffect` for side effects and initialization
- Local state is maintained for the demo, with Supabase integration ready

### Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme colors
- **Custom animations** for smooth transitions
- **Responsive design** with mobile-first approach

## Deployment

### Environment Variables for Production

In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
