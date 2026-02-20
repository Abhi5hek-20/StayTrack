import express from 'express';
import { protectedRoute } from '../../middleware/adminAuth.middleware.js'; 
import { getPaymentHistoryOfSingleUser, updatePaymentHistory } from '../../controllers/admin/adminpaymentHandle.route.js';

const router = express.Router();

router.get('/user-payment-history/:userId', protectedRoute, getPaymentHistoryOfSingleUser)
router.patch('/update-payment-history/:paymentId', protectedRoute, updatePaymentHistory)


export default router;