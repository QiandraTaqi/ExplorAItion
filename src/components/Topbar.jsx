import { Search, Bell, UserCircle, Menu } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex flex-1 items-center gap-3">
        {/* Burger — mobile only */}
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-gray-400" />
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            Warehouse Staff
          </span>
        </div>
      </div>
    </header>
  )
}
