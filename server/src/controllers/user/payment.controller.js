import Payment  from "../../models/user/payment.model.js";

export const makePayment = async (req, res) => {
  try {
    const user = req.user;
    const paymentDetails = {
        userId: user._id,
        amount: 6500,
        method: "upi",
    }
    // console.log("Payment details to be saved:", paymentDetails);    
    const payment = await Payment.create(paymentDetails);

    res.status(200).json({
      success: true,
      message: "Payment saved successfully",
    //   data: payment
    });

  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save payment",
      error: error.message
    });
  }
};



export const getPaymentHistory = async (req, res) => {
  try {
    const user = req.user;
   
    
    const paymentHistory = await Payment.find({ userId: user._id }).sort({ createdAt: -1 });
    // console.log("Payment history fetched:", paymentHistory);
    res.status(200).json({
      success: true,
      paymentHistory,
      message: "Payment History Fetched successfully",
    });

  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message
    });
  }
};
