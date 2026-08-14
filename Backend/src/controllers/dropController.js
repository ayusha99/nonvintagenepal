import Drop from '../models/Drop.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

const DEFAULT_DROPS = [
  {
    slug: 'drop-1',
    label: 'Drop 01 — Full Sleeve',
    title: 'Full Sleeve Tshirts Drop',
    subtitle: 'Drop 01',
    image: '/drops/full-sleeve-drop-1.png',
    sortOrder: 1,
  },
  {
    slug: 'drop-2',
    label: 'Drop 02 — Full Sleeve',
    title: 'Full Sleeve Tshirts Drop',
    subtitle: 'Drop 02',
    image: '/drops/full-sleeve-drop-2.png',
    sortOrder: 2,
  },
  {
    slug: 'drop-3',
    label: 'Drop 03 — Vintage & Jerseys',
    title: 'Vintage Tshirts & Jersey Drop',
    subtitle: 'Mixed archive',
    image: '/drops/vintage-jersey-drop.png',
    sortOrder: 3,
  },
];

export async function ensureDefaultDrops() {
  const count = await Drop.countDocuments();
  if (count === 0) {
    await Drop.insertMany(DEFAULT_DROPS);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// @desc    Public list of active drops
// @route   GET /api/drops
export const getDrops = async (req, res, next) => {
  try {
    await ensureDefaultDrops();
    const drops = await Drop.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json({ success: true, count: drops.length, data: drops });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin — all drops
// @route   GET /api/admin/drops
export const getAdminDrops = async (req, res, next) => {
  try {
    await ensureDefaultDrops();
    const drops = await Drop.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json({ success: true, count: drops.length, data: drops });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin — create drop
// @route   POST /api/admin/drops
export const createDrop = async (req, res, next) => {
  try {
    const { slug, label, title, subtitle, image, sortOrder, isActive } = req.body;
    if (!label || !title || !image) {
      return next(new AppError('Label, title and image are required', 400));
    }

    const finalSlug = slugify(slug || label);
    const exists = await Drop.findOne({ slug: finalSlug });
    if (exists) {
      return next(new AppError('Drop slug already exists', 400));
    }

    const drop = await Drop.create({
      slug: finalSlug,
      label,
      title,
      subtitle: subtitle || '',
      image,
      sortOrder: sortOrder ?? (await Drop.countDocuments()) + 1,
      isActive: isActive !== false,
    });

    res.status(201).json({ success: true, data: drop });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin — update drop
// @route   PUT /api/admin/drops/:id
export const updateDrop = async (req, res, next) => {
  try {
    const drop = await Drop.findById(req.params.id);
    if (!drop) {
      return next(new AppError('Drop not found', 404));
    }

    const { label, title, subtitle, image, sortOrder, isActive } = req.body;
    if (label) drop.label = label;
    if (title) drop.title = title;
    if (subtitle !== undefined) drop.subtitle = subtitle;
    if (image) drop.image = image;
    if (sortOrder !== undefined) drop.sortOrder = Number(sortOrder);
    if (isActive !== undefined) drop.isActive = isActive;

    await drop.save();
    res.json({ success: true, data: drop });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin — delete drop
// @route   DELETE /api/admin/drops/:id
export const deleteDrop = async (req, res, next) => {
  try {
    const drop = await Drop.findById(req.params.id);
    if (!drop) {
      return next(new AppError('Drop not found', 404));
    }

    await Product.updateMany({ drop: drop.slug }, { drop: '' });
    await drop.deleteOne();

    res.json({ success: true, message: 'Drop deleted' });
  } catch (error) {
    next(error);
  }
};

export async function validateProductDrop(dropSlug) {
  if (!dropSlug) return true;
  const drop = await Drop.findOne({ slug: dropSlug, isActive: true });
  return Boolean(drop);
}
