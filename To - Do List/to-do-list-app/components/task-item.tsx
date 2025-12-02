"use client" // Client component - handles interactive task card behavior

// Import React hooks for state management
import { useState } from "react"
// Import UI components from shadcn library
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// Import icons for buttons
import { Check, Trash2, Edit2, Save, X } from "lucide-react"

// Define Task interface (same structure as in page.tsx)
interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string | null
  createdAt: string
}

// Define props that this component receives from parent
interface TaskItemProps {
  task: Task // The task object to display
  isEditing: boolean // Is this task in edit mode?
  onToggle: (id: string) => void // Function to toggle completion
  onUpdate: (id: string, updates: Partial<Task>) => void // Function to save changes
  onDelete: (id: string) => void // Function to delete task
  onEditStart: () => void // Function to enter edit mode
  onEditEnd: () => void // Function to exit edit mode
}

export default function TaskItem({
  task,
  isEditing,
  onToggle,
  onUpdate,
  onDelete,
  onEditStart,
  onEditEnd,
}: TaskItemProps) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "")

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      dueDate: editDueDate || null, // Convert empty string to null
    })
    onEditEnd() // Exit edit mode
  }

  const priorityColors = {
    low: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    medium: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    high: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  }

  const getPriorityBadge = (priority: string) => {
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[priority as keyof typeof priorityColors]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)} {/* Capitalize first letter */}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-500 dark:border-green-600 shadow-lg">
        {/* Editable title input */}
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-lg font-semibold mb-2 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700"
        />

        {/* Editable description textarea */}
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full mb-3 min-h-20"
          placeholder="Description"
        />

        {/* Priority and due date dropdowns */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Priority selector */}
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as "low" | "medium" | "high")}
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Due date picker */}
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        {/* Save and Cancel buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <button
            onClick={onEditEnd}
            className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white rounded-lg py-2 px-3 font-medium flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 transition-all duration-200 ${
        task.completed ? "opacity-60" : "" // Reduce opacity if task is completed
      }`}
    >
      <div className="flex gap-3 items-start">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-green-500 border-green-500 text-white" // Green when completed
              : "border-slate-300 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-500" // Gray when incomplete
          }`}
        >
          {task.completed && <Check className="w-4 h-4" />} {/* Show checkmark if completed */}
        </button>

        <div className="flex-1 min-w-0">
          {/* Task title */}
          <h3
            className={`text-lg font-semibold text-slate-900 dark:text-white break-words ${
              task.completed ? "line-through text-slate-500 dark:text-slate-400" : "" // Strikethrough if completed
            }`}
          >
            {task.title}
          </h3>

          {/* Task description (if exists) */}
          {task.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 break-words">{task.description}</p>
          )}

          {/* Task metadata: priority badge and due date */}
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            {getPriorityBadge(task.priority)}
            {task.dueDate && (
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {/* Edit button */}
          <button
            onClick={onEditStart}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
