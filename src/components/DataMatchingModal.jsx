import { useState } from 'react'
import { ScanLine, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Badge } from './StockTable'

const MANIFESTS = [
  { id: 'M-001', sku: 'SKU-001', itemName: 'Steel Bolts M8', qty: 2450 },
  { id: 'M-002', sku: 'SKU-002', itemName: 'Aluminum Brackets', qty: 320 },
  { id: 'M-003', sku: 'SKU-003', itemName: 'Rubber Gaskets', qty: 15 },
  { id: 'M-004', sku: 'SKU-006', itemName: 'Steel Washers', qty: 50 },
]

export default function DataMatchingModal({ isOpen, onClose, inventory }) {
  const [scanned, setScanned] = useState(null)
  const [result, setResult] = useState(null)

  if (!isOpen) return null

  function matchManifest(manifest) {
    const record = inventory.find((i) => i.sku === manifest.sku)
    if (!record) {
      return {
        status: 'Error Flagged',
        message: `No system record found for ${manifest.sku}`,
        color: 'red',
      }
    }
    if (record.stockQuantity === manifest.qty) {
      return {
        status: 'Matched',
        message: `Quantity matches (${manifest.qty})`,
        color: 'green',
      }
    }
      return {
        status: 'Mismatch/Error Flagged',
        message: `Qty mismatch: system has ${record.stockQuantity}, manifest has ${manifest.qty}`,
        color: 'red',
      }
  }

  function handleScan(m) {
    const r = matchManifest(m)
    setScanned(m)
    setResult(r)
  }

  function reset() {
    setScanned(null)
    setResult(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Incoming Manifest Scanner / Matcher</h3>
            <p className="text-sm text-gray-600">Auto-validate against recorded database entries</p>
          </div>
          <button
            onClick={() => {
              reset()
              onClose()
            }}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Simulate Scan (Incoming Manifests)</h4>
            <div className="space-y-2">
              {MANIFESTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleScan(m)}
                  className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-indigo-500 hover:bg-indigo-50/50"
                >
                  <div className="flex items-center gap-3">
                    <ScanLine className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.id}</p>
                      <p className="text-xs text-gray-600">
                        {m.sku} — {m.itemName} — Qty {m.qty}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-600">Scan →</span>
                </button>
              ))}
            </div>
          </div>

          {scanned && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Scan Result</p>
                <button
                  onClick={reset}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Reset
                </button>
              </div>
              <dl className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Manifest ID</dt>
                  <dd className="font-medium text-gray-900">{scanned.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">SKU</dt>
                  <dd className="font-medium text-gray-900">{scanned.sku}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Item</dt>
                  <dd className="font-medium text-gray-900">{scanned.itemName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Manifest Qty</dt>
                  <dd className="font-medium text-gray-900">{scanned.qty}</dd>
                </div>
              </dl>
              <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3">
                {result?.status === 'Matched' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : result?.status?.includes('Error') ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{result?.status}</p>
                  <p className="text-xs text-gray-600">{result?.message}</p>
                </div>
                <Badge status={result?.status === 'Matched' ? 'Matched' : result?.status === 'Mismatch/Error Flagged' || result?.status === 'Error Flagged' ? 'Error Flagged' : 'Pending Verification'} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              onClick={() => {
                reset()
                onClose()
              }}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
