"use client" // Client component - handles filter interactions

export interface TaskFiltersProps {
  filter: "all" | "active" | "completed" // Current completion status filter
  priorityFilter: "all" | "low" | "medium" | "high" // Current priority filter
  onFilterChange: (filter: "all" | "active" | "completed") => void // Callback when status filter changes
  onPriorityFilterChange: (priority: "all" | "low" | "medium" | "high") => void // Callback when priority filter changes
}

export default function TaskFilters({
  filter,
  priorityFilter,
  onFilterChange,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  const filterOptions = [
    { value: "all", label: "All Tasks" }, // Show all tasks
    { value: "active", label: "Active" }, // Show only incomplete tasks
    { value: "completed", label: "Completed" }, // Show only completed tasks
  ]

  const priorityOptions = [
    { value: "all", label: "All Priorities" }, // Show all priority levels
    { value: "low", label: "Low" }, // Show only low priority
    { value: "medium", label: "Medium" }, // Show only medium priority
    { value: "high", label: "High" }, // Show only high priority
  ]

  return (
    // Container for both filter sections
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        {/* Label for status filter */}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>

        {/* Button group for status filter options */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value as "all" | "active" | "completed")} // Call parent function
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === option.value
                  ? "bg-green-500 dark:bg-green-600 text-white" // Active button styling (green background)
                  : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600" // Inactive button styling (gray background)
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {/* Label for priority filter */}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>

        {/* Dropdown select for priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as "all" | "low" | "medium" | "high")} // Call parent function
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
