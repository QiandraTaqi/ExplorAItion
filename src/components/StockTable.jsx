import { Search } from 'lucide-react'

export function Badge({ status }) {
  const styles = {
    'In Stock': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    'Low Stock': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    'No Stock': 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
    'Pending Match': 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
    Matched: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    'Error Flagged': 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    'Pending Verification': 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
    AutoConfirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'}`}
    >
      {status}
    </span>
  )
}

export function StockTable({ items, searchTerm, onSearchChange }) {
  const filtered = items.filter((item) => {
    const term = searchTerm.toLowerCase()
    return (
      item.sku.toLowerCase().includes(term) ||
      item.itemName.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    )
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Inventory Stockpile</h2>
          <p className="text-sm text-gray-600">Real-time digital database view</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKU, item, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Stock Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
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
                  {item.category}
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
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
