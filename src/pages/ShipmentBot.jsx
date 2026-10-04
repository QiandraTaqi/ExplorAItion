import { useState } from 'react'
import { Bot, CheckCircle2, AlertCircle, Zap, Settings, TrendingUp, Package } from 'lucide-react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'

const DEFAULT_CONFIG = {
  autoConfirmThreshold: 100,
  errorFlagThreshold: 5,
  pollingIntervalSec: 30,
  autoRetryOnError: true,
}

export default function ShipmentBot() {
  const [logs, setLogs] = useState([])
  const [confirming, setConfirming] = useState(false)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [configDirty, setConfigDirty] = useState(false)
  const [configSaved, setConfigSaved] = useState(false)

  const totalConfirmed = logs.filter((l) => l.type === 'confirmed').length
  const totalErrors = logs.filter((l) => l.type === 'error').length
  const errorRate =
    logs.length === 0 ? '0%' : `${Math.round((totalErrors / logs.length) * 100)}%`

  async function handleAutoConfirm() {
    setConfirming(true)
    await new Promise((r) => setTimeout(r, 800))
    const isError = Math.random() < 0.15 // 15% chance of simulated error
    const newLog = {
      id: Date.now().toString(),
      type: isError ? 'error' : 'confirmed',
      message: isError
        ? `Shipment ${logs.length + 1} flagged — quantity mismatch detected`
        : `Shipment ${logs.length + 1} auto-confirmed for matched items`,
      timestamp: new Date().toLocaleTimeString(),
    }
    setLogs((prev) => [newLog, ...prev])
    setConfirming(false)
  }

  function handleConfigChange(key, value) {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setConfigDirty(true)
    setConfigSaved(false)
  }

  function handleSaveConfig() {
    // In a real app this would persist to a backend
    setConfigDirty(false)
    setConfigSaved(true)
    setTimeout(() => setConfigSaved(false), 2000)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shipment Bot</h1>
            <p className="text-sm text-gray-600">
              Automated shipment confirmation — activity feed, stats &amp; configuration
            </p>
          </div>
          <button
            onClick={handleAutoConfirm}
            disabled={confirming}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bot className="h-4 w-4" />
            {confirming ? 'Automating...' : 'Automate Confirmation'}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard
            title="Total Confirmed"
            value={totalConfirmed}
            icon={CheckCircle2}
            color="emerald"
            trend={totalConfirmed > 0 ? `+${totalConfirmed} today` : undefined}
          />
          <StatCard
            title="Errors Flagged"
            value={totalErrors}
            icon={AlertCircle}
            color="amber"
          />
          <StatCard
            title="Error Rate"
            value={errorRate}
            icon={TrendingUp}
            color="indigo"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity Feed */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
              <div className="rounded-md bg-indigo-100 p-2 text-indigo-600">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                <p className="text-sm text-gray-600">Shipment Bot v1.0 — live log</p>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-500">
                  No bot activity yet. Trigger an auto-confirmation to begin.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      {log.type === 'confirmed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.message}</p>
                        <p className="text-xs text-gray-500">{log.timestamp}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        log.type === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-red-50 text-red-700 ring-red-600/20'
                      }`}
                    >
                      {log.type === 'confirmed' ? 'AutoConfirmed' : 'Error Flagged'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Configuration */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
              <div className="rounded-md bg-gray-100 p-2 text-gray-600">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Bot Configuration</h2>
                <p className="text-sm text-gray-600">Adjust automation thresholds &amp; behavior</p>
              </div>
            </div>
            <div className="space-y-5 p-6">
              {/* Auto-confirm threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Auto-Confirm Threshold (units)
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  Shipments above this qty require manual review
                </p>
                <input
                  type="number"
                  min={1}
                  value={config.autoConfirmThreshold}
                  onChange={(e) =>
                    handleConfigChange('autoConfirmThreshold', Number(e.target.value))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Error flag threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Error Flag Threshold (%)
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  Alert when error rate exceeds this percentage
                </p>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={config.errorFlagThreshold}
                  onChange={(e) =>
                    handleConfigChange('errorFlagThreshold', Number(e.target.value))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Polling interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Polling Interval (seconds)
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  How often the bot checks for new shipments
                </p>
                <input
                  type="number"
                  min={5}
                  value={config.pollingIntervalSec}
                  onChange={(e) =>
                    handleConfigChange('pollingIntervalSec', Number(e.target.value))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Auto retry toggle */}
              <div className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Auto-Retry on Error</p>
                  <p className="text-xs text-gray-500">
                    Automatically retry flagged shipments once
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleConfigChange('autoRetryOnError', !config.autoRetryOnError)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.autoRetryOnError ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      config.autoRetryOnError ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Save */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
                {configSaved && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </span>
                )}
                <button
                  onClick={handleSaveConfig}
                  disabled={!configDirty}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap className="h-4 w-4" />
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
