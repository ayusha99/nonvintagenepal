import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PERIODS, useCategoryReports } from '../../hooks/useCategoryReports';
import { AdminBarChart, AdminStackedBarChart } from '../../components/AdminCharts';

const thClass = 'text-left text-[9px] uppercase tracking-wider text-gray-400 font-bold px-4 py-3';
const tdClass = 'px-4 py-3 text-sm text-gray-700 border-t border-gray-100 capitalize';

function formatDateTime(d) {
  return new Date(d).toLocaleString('en-NP', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ReportBlock({ title, subtitle, table, chart }) {
  return (
    <section className="bg-white border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-xs font-black uppercase text-black">{title}</h3>
        {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        <div className="p-4 lg:p-5 overflow-x-auto">{table}</div>
        <div className="p-4 lg:p-5">{chart}</div>
      </div>
    </section>
  );
}

function EmptyRow({ cols, message = 'No data for this period' }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-xs text-gray-400">
        {message}
      </td>
    </tr>
  );
}

function AdminReports() {
  const [period, setPeriod] = useState('weekly');
  const {
    availability,
    stockStatus,
    salesByCategory,
    totals,
    periodLabel,
    loading,
    refreshing,
    lastUpdated,
    refetch,
  } = useCategoryReports(period);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-black" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Live from website</p>
          {lastUpdated && (
            <p className="text-[10px] text-gray-400 mt-1">
              Last updated {formatDateTime(lastUpdated)} · auto-refreshes every 45s
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 text-[10px] uppercase tracking-wider font-black border transition-colors ${
                period === p.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={refetch}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:border-black hover:text-black transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">
        Showing: {periodLabel}
      </p>

      <ReportBlock
        title="Available by category"
        subtitle="Products currently in stock on the website"
        table={
          <table className="w-full min-w-[280px]">
            <thead>
              <tr className="bg-[#f9f9f7]">
                <th className={thClass}>Category</th>
                <th className={thClass}>Items</th>
                <th className={thClass}>Units</th>
              </tr>
            </thead>
            <tbody>
              {availability.length === 0 ? (
                <EmptyRow cols={3} message="No products in stock" />
              ) : (
                availability.map((row) => (
                  <tr key={row.category} className="hover:bg-gray-50/50">
                    <td className={tdClass}>{row.categoryLabel || row.category}</td>
                    <td className={tdClass}>{row.items}</td>
                    <td className={`${tdClass} font-black`}>{row.units}</td>
                  </tr>
                ))
              )}
              {availability.length > 0 && (
                <tr className="bg-[#f9f9f7]">
                  <td className={`${tdClass} font-black`}>Total</td>
                  <td className={`${tdClass} font-black`}>{totals.availableItems}</td>
                  <td className={`${tdClass} font-black`}>{totals.availableUnits}</td>
                </tr>
              )}
            </tbody>
          </table>
        }
        chart={
          <AdminBarChart rows={availability} valueKey="units" labelKey="category" />
        }
      />

      <ReportBlock
        title="In stock vs out of stock"
        subtitle="By category — current inventory status"
        table={
          <table className="w-full min-w-[320px]">
            <thead>
              <tr className="bg-[#f9f9f7]">
                <th className={thClass}>Category</th>
                <th className={thClass}>In stock</th>
                <th className={thClass}>Out of stock</th>
                <th className={thClass}>Units</th>
              </tr>
            </thead>
            <tbody>
              {stockStatus.length === 0 ? (
                <EmptyRow cols={4} />
              ) : (
                stockStatus.map((row) => (
                  <tr key={row.category} className="hover:bg-gray-50/50">
                    <td className={tdClass}>{row.categoryLabel || row.category}</td>
                    <td className={tdClass}>{row.inStock}</td>
                    <td className={tdClass}>{row.outOfStock}</td>
                    <td className={`${tdClass} font-black`}>{row.inStockUnits}</td>
                  </tr>
                ))
              )}
              {stockStatus.length > 0 && (
                <tr className="bg-[#f9f9f7]">
                  <td className={`${tdClass} font-black`}>Total</td>
                  <td className={`${tdClass} font-black`}>{totals.inStock}</td>
                  <td className={`${tdClass} font-black`}>{totals.outOfStock}</td>
                  <td className={`${tdClass} font-black`}>{totals.availableUnits}</td>
                </tr>
              )}
            </tbody>
          </table>
        }
        chart={<AdminStackedBarChart rows={stockStatus} />}
      />

      <ReportBlock
        title="Revenue & sales by category"
        subtitle={`Orders & sold items — ${periodLabel.toLowerCase()}`}
        table={
          <table className="w-full min-w-[320px]">
            <thead>
              <tr className="bg-[#f9f9f7]">
                <th className={thClass}>Category</th>
                <th className={thClass}>Units sold</th>
                <th className={thClass}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesByCategory.length === 0 ? (
                <EmptyRow cols={3} message="No sales in this period" />
              ) : (
                salesByCategory.map((row) => (
                  <tr key={row.category} className="hover:bg-gray-50/50">
                    <td className={tdClass}>{row.categoryLabel || row.category}</td>
                    <td className={tdClass}>{row.unitsSold}</td>
                    <td className={`${tdClass} font-black`}>Rs. {row.revenue.toLocaleString()}</td>
                  </tr>
                ))
              )}
              {salesByCategory.length > 0 && (
                <tr className="bg-[#f9f9f7]">
                  <td className={`${tdClass} font-black`}>Total</td>
                  <td className={`${tdClass} font-black`}>{totals.unitsSold}</td>
                  <td className={`${tdClass} font-black`}>Rs. {totals.revenue.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
        }
        chart={
          <AdminBarChart
            rows={salesByCategory}
            valueKey="revenue"
            labelKey="category"
            formatValue={(v) => `Rs. ${v.toLocaleString()}`}
          />
        }
      />
    </div>
  );
}

export default AdminReports;
