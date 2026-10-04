import { useState, useMemo } from 'react'
import { Package, AlertTriangle, Bot, Plus } from 'lucide-react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import { StockTable } from '../components/StockTable'
import DataMatchingModal from '../components/DataMatchingModal'
import BotStatusFeed from '../components/BotStatusFeed'
import { mockInventoryData } from '../data/mockInventoryData'

export default function Dashboard() {
  const [inventory, setInventory] = useState(mockInventoryData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isMatchingOpen, setIsMatchingOpen] = useState(false)
  const [botLogs, setBotLogs] = useState([])

  const kpis = useMemo(() => {
    const totalStock = inventory.reduce((sum, item) => sum + item.stockQuantity, 0)
    const lowStockItems = inventory.filter(
      (item) => item.status === 'Low Stock' || item.status === 'No Stock'
    ).length
    const autoConfirmedToday = botLogs.length
    return { totalStock, lowStockItems, autoConfirmedToday }
  }, [inventory, botLogs])

  function handleAutoConfirm() {
    const newLog = {
      id: Date.now().toString(),
      message: `Shipment ${botLogs.length + 1} auto-confirmed for matched items`,
      timestamp: new Date().toLocaleTimeString(),
    }
    setBotLogs((prev) => [newLog, ...prev])
  }

  function toggleLiveUpdate() {
    setInventory((prev) => {
      // Find the first item that still has stock remaining
      const targetItem = prev.find((item) => item.stockQuantity > 0)
      if (!targetItem) return prev

      return prev.map((item) => {
        if (item.id === targetItem.id) {
          const newQty = item.stockQuantity - 1
          return {
            ...item,
            stockQuantity: newQty,
            status: newQty === 0 ? 'No Stock' : (newQty <= 20 ? 'Low Stock' : item.status),
          }
        }
        return item
      })
    })
z  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Warehouse Inventory Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Real-time digital database & automated shipment management
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleLiveUpdate}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Simulate Live Update
            </button>
            <button
              onClick={() => setIsMatchingOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <Package className="h-4 w-4" />
              Open Data Matching
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Stock"
            value={kpis.totalStock.toLocaleString()}
            icon={Package}
            trend="+12% this week"
          />
          <StatCard
            title="Low Stock Items"
            value={kpis.lowStockItems}
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Auto-Confirmed Today"
            value={kpis.autoConfirmedToday}
            icon={Bot}
            color="emerald"
            trend={kpis.autoConfirmedToday > 0 ? '+Live' : undefined}
          />
        </div>

        <StockTable items={inventory} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <BotStatusFeed logs={botLogs} onAutoConfirm={handleAutoConfirm} />
      </div>

      <DataMatchingModal
        isOpen={isMatchingOpen}
        onClose={() => setIsMatchingOpen(false)}
        inventory={inventory}
      />
    </Layout>
  )
}
