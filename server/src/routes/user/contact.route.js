import express from 'express';
import { 
  createContact, 
  getUserContacts, 
  getContactById 
} from '../../controllers/user/contact.controller.js';
import { protectedRoute } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected (require user authentication)
router.use(protectedRoute);

// Create a new contact message
router.post('/', createContact);

// Get all contact messages for the authenticated user
router.get('/', getUserContacts);

// Get a specific contact message by ID
router.get('/:contactId', getContactById);

export default router;
