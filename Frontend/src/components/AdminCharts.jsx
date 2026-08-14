function AdminBarChart({ rows, labelKey = 'category', valueKey = 'units', formatValue }) {
  if (!rows?.length) {
    return <p className="text-xs text-gray-400 text-center py-8">No data yet</p>;
  }

  const max = Math.max(...rows.map((r) => r[valueKey]), 1);
  const display = (v) => (formatValue ? formatValue(v) : v);
  const label = (row) => row.categoryLabel || row[labelKey];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row[labelKey]}>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-600 capitalize truncate">
              {label(row)}
            </span>
            <span className="text-[10px] font-black text-black shrink-0">{display(row[valueKey])}</span>
          </div>
          <div className="h-2 bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${(row[valueKey] / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminStackedBarChart({ rows }) {
  if (!rows?.length) {
    return <p className="text-xs text-gray-400 text-center py-8">No data yet</p>;
  }

  const max = Math.max(...rows.map((r) => r.inStock + r.outOfStock), 1);

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const total = row.inStock + row.outOfStock;
        const inPct = (row.inStock / max) * 100;
        const outPct = (row.outOfStock / max) * 100;
        return (
          <div key={row.category}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-600 capitalize truncate">
                {row.categoryLabel || row.category}
              </span>
              <span className="text-[10px] font-black text-black shrink-0">
                {row.inStock} in · {row.outOfStock} out
              </span>
            </div>
            <div className="h-2 bg-gray-100 overflow-hidden flex">
              {row.inStock > 0 && (
                <div className="h-full bg-black transition-all duration-500" style={{ width: `${inPct}%` }} />
              )}
              {row.outOfStock > 0 && (
                <div className="h-full bg-gray-400 transition-all duration-500" style={{ width: `${outPct}%` }} />
              )}
              {total === 0 && <div className="h-full w-full bg-gray-100" />}
            </div>
          </div>
        );
      })}
      <div className="flex gap-4 pt-1">
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
          <span className="w-2 h-2 bg-black" /> In stock
        </span>
        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
          <span className="w-2 h-2 bg-gray-400" /> Out of stock
        </span>
      </div>
    </div>
  );
}

function AdminDonutChart({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let cumulative = 0;

  const gradient = segments
    .map((s) => {
      const start = (cumulative / total) * 100;
      cumulative += s.value;
      const end = (cumulative / total) * 100;
      return `${s.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div
        className="w-32 h-32 rounded-full shrink-0"
        style={{ background: total > 0 ? `conic-gradient(${gradient})` : '#f3f4f6' }}
      />
      <ul className="space-y-2 w-full">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-[10px]">
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="uppercase tracking-wider font-bold text-gray-600">{s.label}</span>
            </span>
            <span className="font-black text-black">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { AdminBarChart, AdminStackedBarChart, AdminDonutChart };
