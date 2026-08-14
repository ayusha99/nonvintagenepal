import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';
import { fillCategoryRows, normalizeCategorySlug } from '../constants/categories';

const POLL_MS = 45000;

export const PERIODS = [
  { id: 'weekly', label: 'Weekly', description: 'Last 7 days' },
  { id: 'monthly', label: 'Monthly', description: 'This month' },
  { id: 'yearly', label: 'Yearly', description: 'This year' },
];

function getPeriodStart(period) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (period === 'weekly') {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return start;
  }
  if (period === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return new Date(now.getFullYear(), 0, 1);
}

function inPeriod(date, periodStart) {
  if (!date) return false;
  return new Date(date) >= periodStart;
}

function computeAnalytics(orders, allProducts, period) {
  const periodStart = getPeriodStart(period);
  const periodMeta = PERIODS.find((p) => p.id === period);

  const availabilityMap = {};
  const stockStatusMap = {};
  const salesMap = {};

  allProducts.forEach((p) => {
    const cat = normalizeCategorySlug(p.category || 'other');
    const isAvailable = p.status === 'available' && (p.stock ?? 0) > 0;

    if (!availabilityMap[cat]) {
      availabilityMap[cat] = { category: cat, items: 0, units: 0 };
    }
    if (!stockStatusMap[cat]) {
      stockStatusMap[cat] = { category: cat, inStock: 0, outOfStock: 0, inStockUnits: 0 };
    }

    if (isAvailable) {
      availabilityMap[cat].items += 1;
      availabilityMap[cat].units += p.stock ?? 1;
      stockStatusMap[cat].inStock += 1;
      stockStatusMap[cat].inStockUnits += p.stock ?? 1;
    } else {
      stockStatusMap[cat].outOfStock += 1;
    }

    if (!isAvailable && inPeriod(p.updatedAt, periodStart)) {
      if (!salesMap[cat]) {
        salesMap[cat] = { category: cat, revenue: 0, unitsSold: 0 };
      }
      salesMap[cat].unitsSold += 1;
      salesMap[cat].revenue += p.price || 0;
    }
  });

  orders
    .filter((o) => o.orderStatus !== 'cancelled' && inPeriod(o.createdAt, periodStart))
    .forEach((order) => {
      order.items?.forEach((item) => {
        const cat = normalizeCategorySlug(item.product?.category || 'other');
        if (!salesMap[cat]) {
          salesMap[cat] = { category: cat, revenue: 0, unitsSold: 0 };
        }
        const qty = item.quantity || 1;
        const lineTotal = (item.price || 0) * qty;
        salesMap[cat].revenue += lineTotal;
        salesMap[cat].unitsSold += qty;
      });
    });

  const sortByUnits = (a, b) => b.units - a.units;
  const sortByRevenue = (a, b) => b.revenue - a.revenue;

  const availability = fillCategoryRows(Object.values(availabilityMap), (slug) => ({
    items: 0,
    units: 0,
  })).sort(sortByUnits);

  const stockStatus = fillCategoryRows(Object.values(stockStatusMap), (slug) => ({
    inStock: 0,
    outOfStock: 0,
    inStockUnits: 0,
  }));

  const salesByCategory = fillCategoryRows(Object.values(salesMap), (slug) => ({
    revenue: 0,
    unitsSold: 0,
  })).sort(sortByRevenue);

  return {
    periodLabel: periodMeta?.description || '',
    availability,
    stockStatus,
    salesByCategory,
    totals: {
      availableItems: availability.reduce((s, r) => s + r.items, 0),
      availableUnits: availability.reduce((s, r) => s + r.units, 0),
      inStock: stockStatus.reduce((s, r) => s + r.inStock, 0),
      outOfStock: stockStatus.reduce((s, r) => s + r.outOfStock, 0),
      revenue: salesByCategory.reduce((s, r) => s + r.revenue, 0),
      unitsSold: salesByCategory.reduce((s, r) => s + r.unitsSold, 0),
    },
  };
}

export function useCategoryReports(period = 'weekly') {
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products?status=all'),
      ]);

      setOrders(ordersRes.data.data || []);
      setAllProducts(productsRes.data.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching category reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(() => fetchData(true), POLL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  const analytics = useMemo(
    () => computeAnalytics(orders, allProducts, period),
    [orders, allProducts, period]
  );

  return {
    ...analytics,
    loading,
    refreshing,
    lastUpdated,
    refetch: () => fetchData(true),
  };
}
