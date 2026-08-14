import ContactMessage from '../models/ContactMessage.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const createMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    let { name, email } = req.body;

    if (req.user) {
      name = req.user.name;
      email = req.user.email;
    }

    if (!name || !email || !subject || !message) {
      return next(new AppError('Please provide name, email, subject, and message', 400));
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      user: req.user?._id || null,
    });

    const previousCount = await ContactMessage.countDocuments({
      _id: { $ne: contactMessage._id },
      $or: [
        ...(req.user?._id ? [{ user: req.user._id }] : []),
        { email: email.toLowerCase() },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contactMessage._id,
        isFollowUp: previousCount > 0,
        previousCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
export const getMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const messages = await ContactMessage.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status / admin notes
// @route   PUT /api/contact/:id
// @access  Admin
export const updateMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    if (req.body.status) {
      message.status = req.body.status;
    }
    if (req.body.adminNotes !== undefined) {
      message.adminNotes = req.body.adminNotes;
    }

    const updated = await message.save();

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    next(error);
  }
};
