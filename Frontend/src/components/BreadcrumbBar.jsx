import { Fragment } from 'react';
import { Link } from 'react-router-dom';

function BreadcrumbBar({ items }) {
  if (!items?.length) return null;

  return (
    <div className="border-y border-gray-100 py-2.5 px-6 lg:px-12 text-[10px] text-gray-400 uppercase tracking-widest font-medium flex flex-wrap items-center gap-1.5">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span>/</span>}
          {item.to ? (
            <Link
              to={item.to}
              className={`hover:text-gray-900 transition-colors ${item.capitalize ? 'capitalize' : ''}`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`text-gray-700 ${item.truncate ? 'truncate max-w-[140px] sm:max-w-xs' : ''}`}
            >
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default BreadcrumbBar;
