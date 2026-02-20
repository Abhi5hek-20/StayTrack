import Contact from '../../models/user/contact.model.js';
import User from '../../models/user/user.model.js';

// Create a new contact message
export const createContact = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user details to auto-populate contact info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create contact message with auto-populated user details
    const contactData = {
      userId: userId,
      name: user.name || user.fullName, // Handle both field names
      email: user.email,
      phoneNumber: user.phoneNumber || user.phno, // Handle both field names
      room: user.roomNo, // Correct field name from User model
      message: message.trim()
    };

    const newContact = new Contact(contactData);
    const savedContact = await newContact.save();

    // Emit socket event to notify all admins of new contact message
    if (global.io) {
      const eventData = {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        room: savedContact.room,
        message: savedContact.message,
        createdAt: savedContact.createdAt,
        type: 'contact'
      };
      
      // Emit to admin room specifically

      global.io.to('admin_admin').emit('new-contact-message', eventData);
    }

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        room: savedContact.room,
        message: savedContact.message,
        createdAt: savedContact.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send contact message',
      error: error.message
    });
  }
};

// Get all contact messages for a user
export const getUserContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
      error: error.message
    });
  }
};

// Get a specific contact message
export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const contact = await Contact.findOne({ _id: contactId, userId });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
      error: error.message
    });
  }
};
