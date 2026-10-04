import { ArrowUpRight } from 'lucide-react'

function StatCard({ title, value, icon: Icon, trend, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`rounded-md p-2 ${colorClasses[color]}`}>

          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        {trend && (
          <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard
