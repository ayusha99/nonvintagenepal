import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BreadcrumbBar from '../components/BreadcrumbBar';
import { buildBreadcrumbs } from '../utils/breadcrumbs';
import { useDrops } from '../hooks/useDrops';

const BreadcrumbContext = createContext(null);

export function BreadcrumbProvider({ children }) {
  const [override, setOverride] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setOverride(null);
  }, [location.pathname, location.search]);

  return (
    <BreadcrumbContext.Provider value={{ setBreadcrumbs: setOverride, override }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function AutoBreadcrumbs() {
  const location = useLocation();
  const ctx = useContext(BreadcrumbContext);
  const { drops } = useDrops();
  const items = ctx?.override ?? buildBreadcrumbs(location.pathname, location.search, { drops });
  if (!items?.length) return null;
  return <BreadcrumbBar items={items} />;
}

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('useBreadcrumbs must be used within BreadcrumbProvider');
  return ctx;
}
