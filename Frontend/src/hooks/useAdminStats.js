import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const emptyStats = {
  totalRevenue: 0,
  totalProducts: 0,
  availableProducts: 0,
  soldProducts: 0,
  totalStockUnits: 0,
  totalOrders: 0,
  pendingOrders: 0,
};

export function useAdminStats(options = {}) {
  const { pollInterval = 0 } = options;
  const [stats, setStats] = useState(emptyStats);
  const [categoryStock, setCategoryStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const [availableRes, allRes, ordersRes] = await Promise.all([
        api.get('/products?status=available'),
        api.get('/products?status=all'),
        api.get('/orders').catch(() => ({ data: { data: [] } })),
      ]);

      const availableProducts = availableRes.data.data || [];
      const allProducts = allRes.data.data || [];
      const available = availableProducts.length;
      const total = allProducts.length;
      const sold = total - available;

      const orders = ordersRes.data.data || [];
      const orderRevenue = orders
        .filter((o) => o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const soldProductRevenue = allProducts
        .filter((p) => p.status !== 'available')
        .reduce((sum, p) => sum + p.price, 0);
      const revenue = orderRevenue > 0 ? orderRevenue : soldProductRevenue;

      const totalStockUnits = availableProducts.reduce((sum, p) => sum + (p.stock ?? 1), 0);
      const pending = orders.filter((o) => o.orderStatus === 'processing').length;

      setStats({
        totalRevenue: revenue,
        totalProducts: total,
        availableProducts: available,
        soldProducts: sold,
        totalStockUnits,
        totalOrders: orders.length,
        pendingOrders: pending,
      });

      const byCategory = {};
      allProducts
        .filter((p) => p.status === 'available' && (p.stock ?? 0) > 0)
        .forEach((p) => {
          const cat = p.category || 'other';
          if (!byCategory[cat]) {
            byCategory[cat] = { category: cat, items: 0, units: 0 };
          }
          byCategory[cat].items += 1;
          byCategory[cat].units += p.stock ?? 1;
        });

      setCategoryStock(Object.values(byCategory).sort((a, b) => b.units - a.units));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    if (!pollInterval) return undefined;
    const id = setInterval(fetchStats, pollInterval);
    return () => clearInterval(id);
  }, [fetchStats, pollInterval]);

  return { stats, categoryStock, loading, lastUpdated, refetch: fetchStats };
}
