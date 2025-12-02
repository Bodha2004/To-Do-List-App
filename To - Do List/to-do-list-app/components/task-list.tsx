"use client" // Client component - renders list of tasks

// Import React hooks
import { useState } from "react"
// Import the TaskItem component that displays individual tasks
import TaskItem from "@/components/task-item"

// Define Task interface (same structure used throughout the app)
interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string | null
  createdAt: string
}

// Define props for this component
interface TaskListProps {
  tasks: Task[] // Array of tasks to display
  onToggle: (id: string) => void // Function to toggle task completion
  onUpdate: (id: string, updates: Partial<Task>) => void // Function to update task
  onDelete: (id: string) => void // Function to delete task
}

export default function TaskList({ tasks, onToggle, onUpdate, onDelete }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const sortedTasks = [...tasks].sort((a, b) => {
    // First, put incomplete tasks before completed tasks
    if (a.completed !== b.completed) return a.completed ? 1 : -1

    // Then, sort incomplete tasks by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    // Container with spacing between task items
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id} // Unique key for React rendering
          task={task} // The task data to display
          isEditing={editingId === task.id} // Is this task in edit mode?
          onToggle={onToggle} // Pass down toggle function
          onUpdate={onUpdate} // Pass down update function
          onDelete={onDelete} // Pass down delete function
          onEditStart={() => setEditingId(task.id)} // Enable edit mode for this task
          onEditEnd={() => setEditingId(null)} // Disable edit mode
        />
      ))}
    </div>
  )
}
