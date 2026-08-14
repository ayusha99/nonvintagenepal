import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items?.length || !shippingAddress || !paymentMethod || totalAmount == null) {
      return next(new AppError('Missing required order fields', 400));
    }

    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product || product.status !== 'available') {
        return next(new AppError(`Product unavailable: ${item.name || 'item'}`, 400));
      }
      const qty = item.quantity || 1;
      if ((product.stock ?? 1) < qty) {
        return next(new AppError(`Insufficient stock for ${product.name}`, 400));
      }
      orderItems.push({
        product: product._id,
        price: product.price,
        quantity: qty,
      });
    }

    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'processing',
    });

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      const newStock = (product.stock ?? 1) - item.quantity;
      product.stock = Math.max(0, newStock);
      if (product.stock <= 0) product.status = 'sold';
      await product.save();
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name images category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return next(new AppError('Order not found', 404));

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name images category');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};
