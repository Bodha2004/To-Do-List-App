"use client" // This marks the file as a Client Component (runs in browser, has access to useState, useEffect)

// Import React hooks for state management and side effects
import { useEffect, useState } from "react"
// Import custom task components
import TaskForm from "@/components/task-form"
import TaskList from "@/components/task-list"
import TaskFilters from "@/components/task-filters"

// Define the Task interface - this describes the structure of each task
interface Task {
  id: string // Unique identifier (timestamp-based)
  title: string // Task name/title (required)
  description: string // Detailed task description (optional)
  completed: boolean // Is the task done or not?
  priority: "low" | "medium" | "high" // Task urgency level
  dueDate: string | null // Optional deadline for the task
  createdAt: string // When the task was created (ISO timestamp)
}

export default function Home() {
  // State to store all tasks
  const [tasks, setTasks] = useState<Task[]>([])

  // State for filtering tasks by completion status (all/active/completed)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // State for filtering tasks by priority level
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")

  // State to track if component has mounted (prevents hydration issues)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks)) // Convert JSON string back to array
      } catch (error) {
        console.error("Failed to load tasks:", error)
      }
    }
    setMounted(true) // Mark component as mounted
  }, []) // Empty dependency array = runs once on mount

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks)) // Convert array to JSON string
    }
  }, [tasks, mounted]) // Runs whenever tasks change AND component is mounted

  const addTask = (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null) => {
    const newTask: Task = {
      id: Date.now().toString(), // Create unique ID from current timestamp
      title,
      description,
      completed: false, // New tasks start as incomplete
      priority,
      dueDate,
      createdAt: new Date().toISOString(), // Current date/time in ISO format
    }
    setTasks([newTask, ...tasks]) // Add new task to beginning of array
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map(
        (task) => (task.id === id ? { ...task, ...updates } : task), // If ID matches, merge updates; otherwise keep original
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id)) // Keep all tasks EXCEPT the one with matching ID
  }

  const toggleTask = (id: string) => {
    updateTask(id, { completed: !tasks.find((t) => t.id === id)?.completed })
  }

  const filteredTasks = tasks.filter((task) => {
    // Check status filter
    const statusMatch =
      filter === "all" || (filter === "completed" && task.completed) || (filter === "active" && !task.completed)
    // Check priority filter
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter
    // Return task only if BOTH filters match
    return statusMatch && priorityMatch
  })

  const stats = {
    total: tasks.length, // Total number of tasks
    completed: tasks.filter((t) => t.completed).length, // Number of completed tasks
    active: tasks.filter((t) => !t.completed).length, // Number of incomplete tasks
  }

  // Don't render anything until component is mounted (prevents hydration mismatch)
  if (!mounted) return null

  return (
    // Main container with gradient background
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-green-400 mb-2 text-balance">
            My Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Stay organized and productive</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Total tasks card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-900">
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{stats.total}</div>
            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total</div>
          </div>

          {/* Active tasks card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-900">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Active</div>
          </div>

          {/* Completed tasks card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-900">
            <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </div>
            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Done</div>
          </div>
        </div>

        <TaskForm onAddTask={addTask} />

        <TaskFilters
          filter={filter}
          priorityFilter={priorityFilter}
          onFilterChange={setFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        <TaskList tasks={filteredTasks} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              {tasks.length === 0 ? "No tasks yet. Create one to get started!" : "No tasks match your filters."}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
