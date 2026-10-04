import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ScanLine, Bot, X } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Package, label: 'Inventory', to: '/inventory' },
  { icon: ScanLine, label: 'Data Matching', to: '/data-matching' },
  { icon: Bot, label: 'Shipment Bot', to: '/shipment-bot' },
]

function NavItems({ onItemClick }) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200">
        <span className="text-lg font-semibold tracking-tight">AwareHouse</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            onClick={onItemClick}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        Warehouse Inventory Prototype
      </div>
    </>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* ── Desktop: static sidebar ── */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
        <NavItems />
      </aside>

      {/* ── Mobile: drawer + backdrop ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        <NavItems onItemClick={onClose} />
      </aside>
    </>
  )
}
