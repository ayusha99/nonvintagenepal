import ContactMessage from '../models/ContactMessage.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Admin notification summary
// @route   GET /api/admin/notifications
// @access  Admin
export const getNotifications = async (req, res, next) => {
  try {
    const [newMessages, pendingOrders] = await Promise.all([
      ContactMessage.find({ status: 'new' })
        .sort({ createdAt: -1 })
        .limit(8)
        .select('name email subject createdAt status'),
      Order.find({ orderStatus: 'processing' })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('user', 'name email')
        .select('totalAmount shippingAddress orderStatus paymentStatus createdAt user'),
    ]);

    const messageItems = newMessages.map((m) => ({
      id: m._id,
      type: 'message',
      title: `New message from ${m.name}`,
      subtitle: m.subject,
      href: '/admin/messages',
      createdAt: m.createdAt,
    }));

    const orderItems = pendingOrders.map((o) => ({
      id: o._id,
      type: 'order',
      title: `New order #${o._id.toString().slice(-6).toUpperCase()}`,
      subtitle: `${o.shippingAddress?.name || o.user?.name || 'Customer'} · Rs. ${o.totalAmount.toLocaleString()}`,
      href: '/admin/orders',
      createdAt: o.createdAt,
    }));

    const items = [...messageItems, ...orderItems]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        total: newMessages.length + pendingOrders.length,
        counts: {
          newMessages: newMessages.length,
          pendingOrders: pendingOrders.length,
        },
        items,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List registered customers with order stats
// @route   GET /api/admin/customers
// @access  Admin
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('name email profilePicture createdAt')
      .sort({ createdAt: -1 });

    const customerIds = customers.map((c) => c._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: customerIds }, orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrderAt: { $max: '$createdAt' },
        },
      },
    ]);

    const statsMap = Object.fromEntries(orderStats.map((s) => [String(s._id), s]));

    const data = customers.map((c) => {
      const stats = statsMap[String(c._id)];
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        profilePicture: c.profilePicture,
        createdAt: c.createdAt,
        orderCount: stats?.orderCount || 0,
        totalSpent: stats?.totalSpent || 0,
        lastOrderAt: stats?.lastOrderAt || null,
      };
    });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer with orders & messages
// @route   GET /api/admin/customers/:id
// @access  Admin
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' }).select('-passwordHash');

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    const [orders, messages] = await Promise.all([
      Order.find({ user: customer._id })
        .populate('items.product', 'name images category price')
        .sort({ createdAt: -1 }),
      ContactMessage.find({
        $or: [{ user: customer._id }, { email: customer.email.toLowerCase() }],
      })
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

    res.json({
      success: true,
      data: {
        customer,
        orders,
        messages,
        stats: {
          orderCount: orders.filter((o) => o.orderStatus !== 'cancelled').length,
          totalSpent: orders
            .filter((o) => o.orderStatus !== 'cancelled')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
          messageCount: messages.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer details
// @route   PUT /api/admin/customers/:id
// @access  Admin
export const updateCustomer = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' });

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    if (name?.trim()) {
      customer.name = name.trim();
    }

    if (email?.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== customer.email) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return next(new AppError('Email already in use', 400));
        }
        customer.email = normalizedEmail;
      }
    }

    if (password) {
      if (password.length < 6) {
        return next(new AppError('Password must be at least 6 characters', 400));
      }
      const salt = await bcrypt.genSalt(10);
      customer.passwordHash = await bcrypt.hash(password, salt);
    }

    await customer.save();

    res.json({
      success: true,
      data: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        profilePicture: customer.profilePicture,
        createdAt: customer.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
