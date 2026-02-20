import express from 'express'
import { 
    getPaymentHistory,
  makePayment
} from '../../controllers/user/payment.controller.js'
import { protectedRoute } from '../../middleware/auth.middleware.js'

const router = express.Router()


router.post('/make-payment', protectedRoute, makePayment)
router.get('/payment-history', protectedRoute, getPaymentHistory)
export default router