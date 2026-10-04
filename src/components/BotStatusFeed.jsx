import { useState } from 'react'
import { Bot, CheckCircle2 } from 'lucide-react'

export default function BotStatusFeed({ logs, onAutoConfirm }) {
  const [confirming, setConfirming] = useState(false)

  async function handleConfirm() {
    setConfirming(true)
    await new Promise((r) => setTimeout(r, 800))
    onAutoConfirm()
    setConfirming(false)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-indigo-100 p-2 text-indigo-600">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Shipment Bot Activity Feed</h2>
            <p className="text-sm text-gray-600">Shipment Bot v1.0 — Automated confirmations</p>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Bot className="h-4 w-4" />
          {confirming ? 'Automating...' : 'Automate Confirmation'}
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {logs.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No bot activity yet. Trigger an auto-confirmation to see activity.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500">{log.timestamp}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                AutoConfirmed
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
