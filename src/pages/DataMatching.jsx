import { useState } from 'react'
import {
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
} from 'lucide-react'
import Layout from '../components/Layout'
import { Badge } from '../components/StockTable'
import { mockInventoryData } from '../data/mockInventoryData'

const MANIFESTS = [
  { id: 'M-001', sku: 'SKU-001', itemName: 'Steel Bolts M8', qty: 2450 },
  { id: 'M-002', sku: 'SKU-002', itemName: 'Aluminum Brackets', qty: 320 },
  { id: 'M-003', sku: 'SKU-003', itemName: 'Rubber Gaskets', qty: 15 },
  { id: 'M-004', sku: 'SKU-006', itemName: 'Steel Washers', qty: 50 },
]

function matchManifest(manifest, inventory) {
  const record = inventory.find((i) => i.sku === manifest.sku)
  if (!record) {
    return {
      status: 'Error Flagged',
      badgeStatus: 'Error Flagged',
      message: `No system record found for ${manifest.sku}`,
    }
  }
  if (record.stockQuantity === manifest.qty) {
    return {
      status: 'Matched',
      badgeStatus: 'Matched',
      message: `Quantity matches (${manifest.qty})`,
    }
  }
  return {
    status: 'Mismatch / Error Flagged',
    badgeStatus: 'Error Flagged',
    message: `Qty mismatch: system has ${record.stockQuantity}, manifest has ${manifest.qty}`,
  }
}

function ResultIcon({ status }) {
  if (status === 'Matched') return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  if (status?.includes('Error') || status?.includes('Mismatch'))
    return <AlertCircle className="h-5 w-5 text-red-600" />
  return <Clock className="h-5 w-5 text-yellow-600" />
}

export default function DataMatching() {
  const [inventory] = useState(mockInventoryData)
  const [scanHistory, setScanHistory] = useState([])
  const [activeResult, setActiveResult] = useState(null)

  function handleScan(manifest) {
    const result = matchManifest(manifest, inventory)
    const entry = {
      id: Date.now().toString(),
      manifest,
      result,
      timestamp: new Date().toLocaleTimeString(),
    }
    setActiveResult(entry)
    setScanHistory((prev) => [entry, ...prev])
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Data Matching</h1>
          <p className="text-sm text-gray-600">
            Scan incoming manifests and auto-validate against the recorded database
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left — Scanner */}
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Incoming Manifest Scanner</h2>
                <p className="text-sm text-gray-600">Click a manifest to simulate scanning</p>
              </div>
              <div className="space-y-2 p-4">
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
                        <p className="text-xs text-gray-500">
                          {m.sku} — {m.itemName} — Qty {m.qty}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600">Scan →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Result */}
            {activeResult && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Last Scan Result</h2>
                </div>
                <div className="p-4">
                  <dl className="mb-4 grid grid-cols-2 gap-4 text-sm">
                    {[
                      ['Manifest ID', activeResult.manifest.id],
                      ['SKU', activeResult.manifest.sku],
                      ['Item', activeResult.manifest.itemName],
                      ['Manifest Qty', activeResult.manifest.qty],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-gray-500">{label}</dt>
                        <dd className="font-medium text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <ResultIcon status={activeResult.result.status} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activeResult.result.status}
                      </p>
                      <p className="text-xs text-gray-500">{activeResult.result.message}</p>
                    </div>
                    <Badge status={activeResult.result.badgeStatus} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — Scan History */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
              <div className="rounded-md bg-indigo-100 p-2 text-indigo-600">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
                <p className="text-sm text-gray-600">{scanHistory.length} scans this session</p>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {scanHistory.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                  No scans yet. Scan a manifest to see results here.
                </div>
              ) : (
                scanHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <ResultIcon status={entry.result.status} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entry.manifest.id} — {entry.manifest.sku}
                        </p>
                        <p className="text-xs text-gray-500">{entry.result.message}</p>
                        <p className="text-xs text-gray-400">{entry.timestamp}</p>
                      </div>
                    </div>
                    <Badge status={entry.result.badgeStatus} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
