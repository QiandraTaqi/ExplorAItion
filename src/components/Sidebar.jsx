import { LayoutDashboard, Package, ScanLine, Bot } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#', active: true },
  { icon: Package, label: 'Inventory', href: '#' },
  { icon: ScanLine, label: 'Data Matching', href: '#' },
  { icon: Bot, label: 'Shipment Bot', href: '#' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200">
        <Bot className="h-6 w-6 text-indigo-600" />
        <span className="text-lg font-semibold tracking-tight">ExplorAItion</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              item.active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        Warehouse Inventory Prototype
      </div>
    </aside>
  )
}
