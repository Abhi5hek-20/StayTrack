import Payment from "../../models/user/payment.model.js";



export const getPaymentHistoryOfSingleUser = async (req, res) => { 
    const { userId } = req.params; 
    try { 
        console.log("Fetching payment history for userId:", userId);
        const paymentHistory = await Payment.find({ userId });
        res.status(200).json(
            { success: true,
              message: "Payment history fetched successfully",  
              userPaymentHistory:paymentHistory
            }); 
} catch (error) { 
    res.status(500).json({ 
        success:false,
        message: error.message });
 } };


export const updatePaymentHistory = async (req, res) => { 
    const { paymentId } = req.params;
    const { amount, method, status } = req.body; 
    try { 
        const paymentHistory = await Payment.findByIdAndUpdate({ _id: paymentId }, { amount, method, status }, { new: true });
        res.status(200).json(
            { success: true,
              message: "Payment history updatedsuccessfully",  
              paymentHistory
            }); 
} catch (error) { 
    res.status(500).json({ 
        success:false,
        message: error.message });
 } };