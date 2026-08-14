export const STORE_CATEGORIES = [
  {
    slug: 'tops',
    label: 'Tops',
    image: 'https://i.pinimg.com/736x/4d/b2/18/4db21806fdc83f2c7197f1505d4dd3e7.jpg',
  },
  {
    slug: 'bottoms',
    label: 'Bottoms',
    image: 'https://i.pinimg.com/736x/c2/7d/8c/c27d8c90674debb507363dc7b704ab48.jpg',
  },
  {
    slug: 'jorts',
    label: 'Jorts',
    image: 'https://i.pinimg.com/1200x/48/c0/f7/48c0f78050187a7b5eb96155d0a677c5.jpg',
  },
  {
    slug: 'hoodies',
    label: 'Hoodies',
    image: 'https://i.pinimg.com/1200x/32/c9/4f/32c94f655b0cbda2753043124a07d5ce.jpg',
  },
  {
    slug: 'graphic-tees',
    label: 'Graphic Tees',
    image: 'https://i.pinimg.com/1200x/d3/4c/b6/d34cb6f7784b9e9801aede628a5276f6.jpg',
  },
  {
    slug: 'denim',
    label: 'Denim',
    image: 'https://i.pinimg.com/1200x/e4/dd/6a/e4dd6a2ce75317cff1c6d034272b664b.jpg',
  },
  {
    slug: 'jackets',
    label: 'Jackets',
    image: 'https://i.pinimg.com/736x/1c/58/45/1c584531154b2cda7eeabb5c38bcdd67.jpg',
  },
  {
    slug: 'jerseys',
    label: 'Jerseys',
    image: 'https://i.pinimg.com/736x/11/dd/0c/11dd0cf327b591069ca61b6addb5c86d.jpg',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    image: 'https://i.pinimg.com/736x/44/2e/d3/442ed3573b616b887897aed871164931.jpg',
  },
  {
    slug: 'bags',
    label: 'Bags',
    image: 'https://i.pinimg.com/1200x/87/76/b2/8776b2e800f89a9966a3d014aa1f3df3.jpg',
  },
];

export const PRODUCT_CATEGORIES = STORE_CATEGORIES.map((c) => c.slug);

export const CATEGORY_LABELS = Object.fromEntries([
  ...STORE_CATEGORIES.map((c) => [c.slug, c.label]),
  ['Jort', 'Jorts'],
  ['Hoddie', 'Hoodies'],
  ['Jersey', 'Jerseys'],
  ['accessorie', 'Accessories'],
]);

export function getCategoryLabel(slug) {
  return CATEGORY_LABELS[slug] || slug?.replace(/-/g, ' ') || 'Tops';
}

export function getCategoryPath(slug) {
  return `/products?category=${slug}`;
}

export const HOME_CATEGORIES = [
  ...STORE_CATEGORIES.map((c) => ({
    name: c.label,
    path: getCategoryPath(c.slug),
    image: c.image,
  })),
  {
    name: 'Shop All',
    path: '/products',
    image: 'https://i.pinimg.com/1200x/98/c7/52/98c752042562281b6c002c3ef8636c02.jpg',
  },
];

export const PRODUCT_LIST_CATEGORIES = [
  { value: '', label: 'All' },
  ...STORE_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
];

export function normalizeCategorySlug(slug) {
  const legacyMap = {
    Jort: 'jorts',
    Hoddie: 'hoodies',
    Jersey: 'jerseys',
    accessorie: 'accessories',
    dresses: 'tops',
    outerwear: 'jackets',
    shoes: 'accessories',
    other: 'tops',
  };
  const normalized = legacyMap[slug] || slug;
  return PRODUCT_CATEGORIES.includes(normalized) ? normalized : 'tops';
}

export function fillCategoryRows(rows, buildEmpty) {
  const bySlug = {};
  rows.forEach((r) => {
    const slug = normalizeCategorySlug(r.category);
    if (!bySlug[slug]) {
      bySlug[slug] = { ...buildEmpty(slug), category: slug, categoryLabel: getCategoryLabel(slug) };
    }
    Object.keys(r).forEach((key) => {
      if (key === 'category' || key === 'categoryLabel') return;
      if (typeof r[key] === 'number') {
        bySlug[slug][key] = (bySlug[slug][key] || 0) + r[key];
      }
    });
  });

  return PRODUCT_CATEGORIES.map((slug) => {
    if (bySlug[slug]) return bySlug[slug];
    return { ...buildEmpty(slug), category: slug, categoryLabel: getCategoryLabel(slug) };
  });
}
