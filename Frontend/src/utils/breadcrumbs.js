import { getCategoryLabel, normalizeCategorySlug } from '../constants/categories';
import { STORE_DROPS } from '../constants/drops';

const PAGE_LABELS = {
  '/login': 'Login',
  '/signup': 'Sign up',
  '/forgot-password': 'Forgot password',
  '/reset-password': 'Reset password',
  '/privacy-policy': 'Privacy Policy',
  '/our-story': 'Our Story',
  '/contact': 'Contact',
  '/faq': 'FAQ',
  '/shipping': 'Shipping Info',
  '/profile/orders': 'My orders',
  '/order-confirmed': 'Order confirmed',
  '/profile/wishlist': 'Wishlist',
};

export function getDropLabel(slug, drops = []) {
  if (!slug) return '';
  const fromApi = drops.find((d) => d.slug === slug || d.id === slug);
  if (fromApi?.label) return fromApi.label;
  if (fromApi?.title) return fromApi.title;
  const match = STORE_DROPS.find((d) => d.id === slug);
  if (match) return match.label;
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildProductBreadcrumbs(product, { drops = [] } = {}) {
  if (!product) return null;

  const items = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/products' },
  ];

  if (product.drop) {
    items.push({
      label: getDropLabel(product.drop, drops),
      to: `/products?drop=${product.drop}`,
    });
  } else if (product.category) {
    const slug = normalizeCategorySlug(product.category);
    items.push({
      label: getCategoryLabel(slug),
      to: `/products?category=${slug}`,
    });
  }

  items.push({ label: product.name, truncate: true });
  return items;
}

export function buildBreadcrumbs(pathname, search = '', { drops = [] } = {}) {
  if (pathname === '/') return null;

  const items = [{ label: 'Home', to: '/' }];
  const params = new URLSearchParams(search);

  if (pathname === '/products') {
    items.push({ label: 'Shop', to: '/products' });

    const category = params.get('category');
    const drop = params.get('drop');
    const searchQuery = params.get('search');

    if (drop) {
      items.push({ label: getDropLabel(drop, drops) });
    } else if (category) {
      items.push({ label: getCategoryLabel(normalizeCategorySlug(category)) });
    } else if (searchQuery) {
      items.push({ label: `"${searchQuery}"`, truncate: true });
    } else {
      items.push({ label: 'All Products' });
    }

    return items;
  }

  if (pathname.startsWith('/products/')) {
    return null;
  }

  if (pathname === '/cart') {
    items.push({ label: 'Shop', to: '/products' });
    items.push({ label: 'Bag' });
    return items;
  }

  if (pathname === '/checkout' || pathname === '/order-confirmed') {
    return null;
  }

  if (pathname === '/profile') {
    items.push({ label: 'My account' });
    return items;
  }

  if (pathname.startsWith('/profile/')) {
    items.push({ label: 'My account', to: '/profile' });
    items.push({ label: PAGE_LABELS[pathname] || 'Profile' });
    return items;
  }

  if (PAGE_LABELS[pathname]) {
    items.push({ label: PAGE_LABELS[pathname] });
    return items;
  }

  return null;
}
