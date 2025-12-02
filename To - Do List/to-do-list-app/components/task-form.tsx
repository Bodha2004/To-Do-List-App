"use client" // Client component - handles form interactions and state

// Import React hooks
import type React from "react"
import { useState } from "react"
// Import UI components from shadcn library
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// Import Plus icon from lucide-react icon library
import { Plus } from "lucide-react"

// Define props type for this component
interface TaskFormProps {
  // Function to call when a new task is submitted
  onAddTask: (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Prevent page reload
    if (!title.trim()) return // Don't create task if title is empty

    // Call parent function to add the task
    onAddTask(title, description, priority, dueDate || null)

    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setIsOpen(false) // Close the form
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)} // Open form when clicked
        className="w-full mb-8 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg py-3 px-4 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5" />
        Add New Task
      </button>
    )
  }

  return (
    <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg p-6 border border-green-200 dark:border-green-900 shadow-lg">
      {/* Form title */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Task</h2>

      {/* Form element with submission handler */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title Input Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Task Title *</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update title state as user types
            placeholder="What do you need to do?"
            className="w-full"
            autoFocus // Focus on this input when form opens
          />
        </div>

        {/* Task Description Input Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update description state as user types
            placeholder="Add more details (optional)"
            className="w-full min-h-24"
          />
        </div>

        {/* Priority and Due Date Section - displayed side by side on larger screens */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} // Update priority state
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)} // Update due date state
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex gap-3 pt-4">
          {/* Create Task button */}
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            Create Task
          </Button>

          {/* Cancel button - closes the form without saving */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg py-2 px-4 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
