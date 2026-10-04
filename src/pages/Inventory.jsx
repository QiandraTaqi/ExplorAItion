import { useState, useMemo } from 'react'
import { Download, Search, Filter } from 'lucide-react'
import Layout from '../components/Layout'
import { StockTable, Badge } from '../components/StockTable'
import { mockInventoryData } from '../data/mockInventoryData'

const ALL_CATEGORIES = ['All', ...Array.from(new Set(mockInventoryData.map((i) => i.category)))]

function exportToCSV(data) {
  const headers = ['SKU', 'Item Name', 'Category', 'Stock Qty', 'Status']
  const rows = data.map((item) => [
    item.sku,
    item.itemName,
    item.category,
    item.stockQuantity,
    item.status,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'inventory.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Inventory() {
  const [inventory] = useState(mockInventoryData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const term = searchTerm.toLowerCase()
      const matchesSearch =
        item.sku.toLowerCase().includes(term) ||
        item.itemName.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [inventory, searchTerm, selectedCategory])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-600">
              Full stockpile view — filter by category or export to CSV
            </p>
          </div>
          <button
            onClick={() => exportToCSV(filtered)}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search SKU, item, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Inventory Stockpile</h2>
              <p className="text-sm text-gray-600">
                Showing {filtered.length} of {inventory.length} items
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['SKU', 'Item Name', 'Category', 'Stock Qty', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.sku}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.itemName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.stockQuantity.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Badge status={item.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No items match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
