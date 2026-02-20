import express from 'express'
import { 
  checkOut, 
  checkIn, 
  getLogEntries, 
  getCurrentlyOut, 
  getLogStats 
} from '../../controllers/user/logbook.controller.js'
import { protectedRoute } from '../../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication
router.use(protectedRoute);

// POST /api/logbook/checkout - Record check out
router.post('/checkout', checkOut)

// PUT /api/logbook/checkin/:logId - Record check in
router.put('/checkin/:logId', checkIn)

// GET /api/logbook/entries - Get all log entries for user
router.get('/entries', getLogEntries)

// GET /api/logbook/currently-out - Get currently out entries
router.get('/currently-out', getCurrentlyOut)

// GET /api/logbook/stats - Get log statistics
router.get('/stats', getLogStats)

export default router
