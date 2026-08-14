import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { HOME_DROP_ITEMS } from '../constants/drops';

export function mapDrop(drop) {
  if (!drop) return null;
  return {
    id: drop.slug,
    slug: drop.slug,
    label: drop.label,
    title: drop.title,
    subtitle: drop.subtitle || '',
    image: drop.image,
    link: `/products?drop=${drop.slug}`,
    _id: drop._id,
    isActive: drop.isActive !== false,
    sortOrder: drop.sortOrder ?? 0,
  };
}

export function useDrops({ admin = false, activeOnly = false } = {}) {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrops = useCallback(async () => {
    setLoading(true);
    try {
      const url = admin ? '/admin/drops' : '/drops';
      const res = await api.get(url);
      let list = (res.data.data || []).map(mapDrop);
      if (activeOnly) list = list.filter((d) => d.isActive);
      setDrops(list);
    } catch (error) {
      console.error('Failed to load drops:', error);
      setDrops(HOME_DROP_ITEMS);
    } finally {
      setLoading(false);
    }
  }, [admin, activeOnly]);

  useEffect(() => {
    fetchDrops();
  }, [fetchDrops]);

  return { drops, loading, refetch: fetchDrops };
}

export function getDropLabelFromList(drops, slug) {
  return drops.find((d) => d.slug === slug)?.label || slug || '';
}
