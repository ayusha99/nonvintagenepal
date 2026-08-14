export const STORE_DROPS = [
  {
    id: 'drop-1',
    label: 'Drop 01 — Full Sleeve',
    title: 'Full Sleeve Tshirts Drop',
    subtitle: 'Drop 01',
    image: '/drops/full-sleeve-drop-1.png',
  },
  {
    id: 'drop-2',
    label: 'Drop 02 — Full Sleeve',
    title: 'Full Sleeve Tshirts Drop',
    subtitle: 'Drop 02',
    image: '/drops/full-sleeve-drop-2.png',
  },
  {
    id: 'drop-3',
    label: 'Drop 03 — Vintage & Jerseys',
    title: 'Vintage Tshirts & Jersey Drop',
    subtitle: 'Mixed archive',
    image: '/drops/vintage-jersey-drop.png',
  },
];

export const DROP_IDS = STORE_DROPS.map((d) => d.id);

export function getDropLabel(dropId) {
  return STORE_DROPS.find((d) => d.id === dropId)?.label || '';
}

export function getDropPath(dropId) {
  return `/products?drop=${dropId}`;
}

export const HOME_DROP_ITEMS = STORE_DROPS.map((d) => ({
  image: d.image,
  title: d.title,
  subtitle: d.subtitle,
  link: getDropPath(d.id),
  id: d.id,
}));
